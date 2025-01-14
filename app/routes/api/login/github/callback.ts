import { createAPIFileRoute } from "@tanstack/start/api"
import { OAuth2RequestError } from "arctic"
import { eq } from "drizzle-orm"
import { getCookie } from "vinxi/http"
import { z } from "zod"

import { github } from "@/server/auth/oauth"
import { setSession } from "@/server/auth/sessions"
import { db } from "@/server/db/client"
import { oauthAccountsTable, usersTable } from "@/server/db/schema"
import { createOAuthUser } from "@/shared/services/create-oauth-user"

const GithubUser = z.object({
	id: z.number(),
	name: z.string(),
	avatar_url: z.string(),
	email: z.string().email().nullable()
})

const getPrimaryEmail = async (tokens: { accessToken: () => string }) => {
	const res = await fetch("https://api.github.com/user/emails", {
		headers: { Authorization: `token ${tokens.accessToken()}` }
	})

	const emails = (await res.json()) as { email: string; primary: boolean }[]
	const primaryEmail = emails.find((email) => email.primary)?.email

	if (!primaryEmail) {
		throw new Error("No primary email found")
	}

	return primaryEmail
}

export const APIRoute = createAPIFileRoute("/api/login/github/callback")({
	GET: async ({ request }) => {
		const url = new URL(request.url)
		const code = url.searchParams.get("code")
		const state = url.searchParams.get("state")
		const storedState = getCookie("github_oauth_state")

		if (!code || !state || !storedState || state !== storedState) {
			return new Response(null, {
				status: 400
			})
		}

		try {
			const oauthUrl = "https://api.github.com/user"
			const tokens = await github.validateAuthorizationCode(code)
			const githubUserResponse = await fetch(oauthUrl, {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})

			const githubUserUnparsed = await githubUserResponse.json()
			const githubUserParsed = GithubUser.safeParse(githubUserUnparsed)

			if (!githubUserParsed.success) {
				return new Response(null, {
					status: 400,
					statusText: "Bad Request"
				})
			}

			const githubUser = {
				...githubUserParsed.data,
				email: githubUserParsed.data.email ?? (await getPrimaryEmail(tokens))
			}

			const existingGithubUser = await db
				.select({
					id: usersTable.id,
					email: usersTable.email
				})
				.from(usersTable)
				.innerJoin(oauthAccountsTable, eq(usersTable.id, oauthAccountsTable.userId))
				.where(eq(oauthAccountsTable.providerUserId, githubUser.id.toString()))
				.limit(1)
				.then((res) => res[0] ?? null)

			if (existingGithubUser) {
				await setSession({ userId: existingGithubUser.id })
				return new Response(null, {
					status: 302,
					headers: {
						Location: "/"
					}
				})
			}

			const newUser = await createOAuthUser({
				name: githubUser.name,
				email: githubUser.email,
				avatarUrl: githubUser.avatar_url,
				providerUserId: githubUser.id.toString(),
				providerId: "github"
			})

			await setSession({ userId: newUser.id })

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/"
				}
			})
		} catch (e) {
			if (e instanceof OAuth2RequestError) {
				return new Response(null, {
					status: 400
				})
			}

			return new Response(null, {
				status: 500
			})
		}
	}
})

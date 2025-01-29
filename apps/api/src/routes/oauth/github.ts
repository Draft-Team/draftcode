import { github } from "@/auth/oauth"
import { setSession } from "@/auth/sessions"
import { db } from "@/db/client"
import { oauthAccountsTable, usersTable } from "@/db/schema"
import { env } from "@/environment/env"
import type { ErrorResponse } from "@/types/response"
import { createOAuthUser } from "@/utils/create-oauth-user"
import { generateState, OAuth2RequestError } from "arctic"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { z } from "zod"

const STATE_COOKIE_NAME = "github_oauth_state"

const OAUTH_FETCH_URL = "https://api.github.com/user"

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
		throw new Error("Email primário não encontrado")
	}

	return primaryEmail
}

export const githubOauthRouter = new Hono()
	.get("/", async (c) => {
		const state = generateState()
		const url = github.createAuthorizationURL(state, ["user:email", "read:user"])

		setCookie(c, STATE_COOKIE_NAME, state, {
			path: "/",
			secure: env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 60,
			sameSite: "lax"
		})

		return c.redirect(url.toString())
	})
	.get("/callback", async (c) => {
		const url = new URL(c.req.url)
		const code = url.searchParams.get("code")
		const state = url.searchParams.get("state")
		const storedState = getCookie(c, STATE_COOKIE_NAME)

		if (!code || !state || !storedState || state !== storedState) {
			return c.json<ErrorResponse>({ error: "State inválido", success: false }, 400)
		}

		try {
			const tokens = await github.validateAuthorizationCode(code)
			const githubUserResponse = await fetch(OAUTH_FETCH_URL, {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})

			const githubUserUnparsed = await githubUserResponse.json()
			const githubUserParsed = GithubUser.safeParse(githubUserUnparsed)

			if (!githubUserParsed.success) {
				return c.json<ErrorResponse>(
					{ error: "Erro no parse do Github User", success: false },
					500
				)
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
				return c.redirect(env.FRONTEND_URL, 302)
			}

			const newUser = await createOAuthUser({
				name: githubUser.name,
				email: githubUser.email,
				avatarUrl: githubUser.avatar_url,
				providerUserId: githubUser.id.toString(),
				providerId: "github"
			})

			await setSession({ userId: newUser.id })

			return c.redirect(env.FRONTEND_URL, 302)
		} catch (error) {
			if (error instanceof OAuth2RequestError) {
				return c.json<ErrorResponse>({ error: error.message, success: false }, 400)
			}

			return c.json<ErrorResponse>({ error: "Ocorreu um erro", success: false }, 500)
		}
	})

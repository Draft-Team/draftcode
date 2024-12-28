import { createAPIFileRoute } from "@tanstack/start/api"
import { OAuth2RequestError } from "arctic"
import { eq } from "drizzle-orm"
import { getCookie } from "vinxi/http"
import { z } from "zod"

import { google } from "@/server/auth/oauth"
import { setSession } from "@/server/auth/sessions"
import { db } from "@/server/db/client"
import {
	imagesTable,
	oauthAccountsTable,
	profileImagesTable,
	profilesTable,
	usersTable
} from "@/server/db/schema"

const GoogleUser = z.object({
	sub: z.string(),
	name: z.string(),
	picture: z.string(),
	email: z.string().email()
})

export const APIRoute = createAPIFileRoute("/api/login/google/callback")({
	GET: async ({ request }) => {
		const url = new URL(request.url)
		const code = url.searchParams.get("code")
		const state = url.searchParams.get("state")
		const storedState = getCookie("google_oauth_state")
		const codeVerifier = getCookie("google_code_verifier")

		if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
			return new Response(null, {
				status: 400
			})
		}

		try {
			const oauthUrl = "https://openidconnect.googleapis.com/v1/userinfo"
			const tokens = await google.validateAuthorizationCode(code, codeVerifier)
			const googleUserResponse = await fetch(oauthUrl, {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})

			const googleUserUnparsed = await googleUserResponse.json()
			const googleUserParsed = GoogleUser.safeParse(googleUserUnparsed)

			if (!googleUserParsed.success) {
				return new Response(null, {
					status: 400,
					statusText: "Bad Request"
				})
			}

			const googleUser = googleUserParsed.data

			const existingGoogleUser = await db
				.select({
					id: usersTable.id,
					email: usersTable.email
				})
				.from(usersTable)
				.innerJoin(oauthAccountsTable, eq(usersTable.id, oauthAccountsTable.userId))
				.where(eq(oauthAccountsTable.providerUserId, googleUser.sub))
				.limit(1)
				.then((res) => res[0] ?? null)

			if (existingGoogleUser) {
				await setSession({ userId: existingGoogleUser.id })
				return new Response(null, {
					status: 302,
					headers: {
						Location: "/"
					}
				})
			}

			const newUser = await db.transaction(async (tx) => {
				const newGoogleUser = await tx
					.insert(usersTable)
					.values({
						role: "user",
						name: googleUser.name,
						email: googleUser.email
					})
					.returning()
					.get()

				await tx
					.insert(oauthAccountsTable)
					.values({
						userId: newGoogleUser.id,
						providerId: "google",
						providerUserId: googleUser.sub
					})
					.returning()
					.get()

				const profile = await tx
					.insert(profilesTable)
					.values({
						userId: newGoogleUser.id
					})
					.returning()
					.get()

				const images = await tx
					.insert(imagesTable)
					.values({
						type: "profile-avatar",
						url: googleUser.picture
					})
					.returning()
					.get()

				await tx.insert(profileImagesTable).values({
					imageId: images.id,
					profileId: profile.id
				})

				return newGoogleUser
			})

			await setSession({ userId: newUser.id })

			return new Response(null, {
				status: 302,
				headers: {
					Location: "/"
				}
			})
		} catch (error) {
			if (error instanceof OAuth2RequestError) {
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

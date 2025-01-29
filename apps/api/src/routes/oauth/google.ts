import { google } from "@/auth/oauth"
import { setSession } from "@/auth/sessions"
import { db } from "@/db/client"
import { oauthAccountsTable, usersTable } from "@/db/schema"
import { env } from "@/environment/env"
import type { ErrorResponse } from "@/types/response"
import { createOAuthUser } from "@/utils/create-oauth-user"
import { generateCodeVerifier, generateState, OAuth2RequestError } from "arctic"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { getCookie, setCookie } from "hono/cookie"
import { z } from "zod"

const STATE_COOKIE_NAME = "google_oauth_state"
const CODE_VERIFIER_COOKIE_NAME = "google_code_verifier"

const OAUTH_FETCH_URL = "https://openidconnect.googleapis.com/v1/userinfo"

const GoogleUser = z.object({
	sub: z.string(),
	name: z.string(),
	picture: z.string(),
	email: z.string().email()
})

export const googleOauthRouter = new Hono()
	.get("/", async (c) => {
		const state = generateState()
		const codeVerifier = generateCodeVerifier()
		const url = google.createAuthorizationURL(state, codeVerifier, ["profile", "email"])

		setCookie(c, STATE_COOKIE_NAME, state, {
			path: "/",
			secure: env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax"
		})

		setCookie(c, CODE_VERIFIER_COOKIE_NAME, codeVerifier, {
			path: "/",
			secure: env.NODE_ENV === "production",
			httpOnly: true,
			maxAge: 60 * 10,
			sameSite: "lax"
		})

		return c.redirect(url.toString())
	})
	.get("/callback", async (c) => {
		const url = new URL(c.req.url)
		const code = url.searchParams.get("code")
		const state = url.searchParams.get("state")
		const storedState = getCookie(c, STATE_COOKIE_NAME)
		const codeVerifier = getCookie(c, CODE_VERIFIER_COOKIE_NAME)

		if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
			return c.json<ErrorResponse>({ error: "State inválido", success: false }, 400)
		}

		try {
			const tokens = await google.validateAuthorizationCode(code, codeVerifier)
			const googleUserResponse = await fetch(OAUTH_FETCH_URL, {
				headers: {
					Authorization: `Bearer ${tokens.accessToken()}`
				}
			})

			const googleUserUnparsed = await googleUserResponse.json()
			const googleUserParsed = GoogleUser.safeParse(googleUserUnparsed)

			if (!googleUserParsed.success) {
				return c.json<ErrorResponse>(
					{ error: "Erro no parse do Google User", success: false },
					400
				)
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
				return c.redirect(env.FRONTEND_URL, 302)
			}

			const newUser = await createOAuthUser({
				name: googleUser.name,
				email: googleUser.email,
				avatarUrl: googleUser.picture,
				providerUserId: googleUser.sub,
				providerId: "google"
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

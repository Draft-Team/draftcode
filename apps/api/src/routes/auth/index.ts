import { z } from "zod"
import {
	checkPasswordLeaks,
	checkPasswordStrength,
	hashPassword,
	verifyPassword
} from "../../utils/check-password"
import { validator } from "hono/validator"
import { setSession } from "../../auth/sessions"
import { db } from "../../db/client"
import { eq } from "drizzle-orm"
import { profilesTable, usersTable } from "../../db/schema"
import { Hono } from "hono"
import type { ErrorResponse, SuccessResponse } from "@/types/response"

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6).max(100)
})

const RegisterSchema = z.object({
	email: z.string().email(),
	name: z.string().min(2).max(50),
	password: z.string().min(6).max(100)
})

export const authRouter = new Hono()
	.post(
		"/login",
		validator("json", (value, c) => {
			const parsed = LoginSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 401)
			}
			return parsed.data
		}),
		async (c) => {
			const userData = c.req.valid("json")

			const { feedback } = checkPasswordStrength(userData.password)

			if (feedback.warning) {
				return c.json<ErrorResponse>(
					{ error: "Email ou senha incorretos", success: false },
					400
				)
			}

			const checkForPasswordLeaks = await checkPasswordLeaks(userData.password)

			if (checkForPasswordLeaks) {
				return c.json<ErrorResponse>(
					{ error: "Email ou senha incorretos", success: false },
					400
				)
			}

			const existingUser = await db.query.usersTable.findFirst({
				where: eq(usersTable.email, userData.email)
			})

			if (!existingUser?.passwordHash) {
				return c.json<ErrorResponse>(
					{ error: "Email ou senha incorretos", success: false },
					400
				)
			}

			const validPassword = await verifyPassword(
				userData.password,
				existingUser.passwordHash
			)

			if (!validPassword) {
				return c.json<ErrorResponse>(
					{ error: "Email ou senha incorretos", success: false },
					400
				)
			}

			await setSession({ userId: existingUser.id })

			return c.json<SuccessResponse>({ success: true })
		}
	)
	.post(
		"/register",
		validator("json", (value, c) => {
			const parsed = RegisterSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 401)
			}
			return parsed.data
		}),
		async (c) => {
			const userData = c.req.valid("json")

			const existingUser = await db.query.usersTable.findFirst({
				where: eq(usersTable.email, userData.email)
			})

			if (existingUser) {
				return c.json<ErrorResponse>(
					{
						error: "Falha no cadastro. Verifique os dados e tente novamente.",
						success: false
					},
					400
				)
			}

			const { feedback } = checkPasswordStrength(userData.password)

			if (feedback.warning) {
				return c.json<ErrorResponse>({ error: feedback.warning, success: false }, 400)
			}

			const checkForPasswordLeaks = await checkPasswordLeaks(userData.password)

			if (checkForPasswordLeaks) {
				return c.json<ErrorResponse>(
					{ error: "Esta senha foi vazada em uma violação de dados", success: false },
					400
				)
			}

			const hashedPassword = await hashPassword(userData.password)

			const newUser = await db.transaction(async (tx) => {
				const user = await tx
					.insert(usersTable)
					.values({
						role: "user",
						email: userData.email,
						name: userData.name,
						passwordHash: hashedPassword
					})
					.returning()
					.get()

				await tx.insert(profilesTable).values({
					userId: user.id,
					totalExperience: 0
				})

				return user
			})

			await setSession({ userId: newUser.id })

			return c.json<SuccessResponse>({ success: true })
		}
	)

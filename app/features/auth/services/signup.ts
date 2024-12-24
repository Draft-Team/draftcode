import { redirect } from "@tanstack/react-router"

import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { setSession } from "@/server/auth/sessions"
import { db } from "@/server/db/client"
import { profilesTable, usersTable } from "@/server/db/schema"
import { csrfProtectionMiddleware } from "@/server/utils/middlewares"
import {
	checkPasswordLeaks,
	checkPasswordStrength,
	hashPassword
} from "@/server/utils/password"

export const $signup = createServerFn({ method: "POST" })
	.middleware([csrfProtectionMiddleware])
	.validator(
		z.object({
			email: z.string().email(),
			name: z.string().min(2).max(100),
			password: z.string().min(6).max(100)
		})
	)
	.handler(async ({ data }) => {
		const existingUser = await db.query.usersTable.findFirst({
			where: eq(usersTable.email, data.email)
		})

		if (existingUser) {
			throw new Error(
				"Falha ao se cadastrar. Verifique seus dados ou tente outro endereço de email."
			)
		}

		const { feedback } = checkPasswordStrength(data.password)

		if (feedback.warning) {
			throw new Error(feedback.warning)
		}

		const checkForPasswordLeaks = await checkPasswordLeaks(data.password)

		if (checkForPasswordLeaks) {
			throw new Error("Esta senha foi vazada em uma violação de dados")
		}

		const hashedPassword = await hashPassword(data.password)

		const user = await db
			.insert(usersTable)
			.values({
				name: data.name,
				email: data.email,
				passwordHash: hashedPassword
			})
			.returning()
			.then((res) => res[0] ?? null)

		if (!user) {
			throw new Error("Falha ao se cadastrar. Tente novamente mais tarde.")
		}

		await db.insert(profilesTable).values({
			userId: user.id
		})

		await setSession({ userId: user.id })

		throw redirect({ to: "/" })
	})

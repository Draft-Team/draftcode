import { redirect } from "@tanstack/react-router"

import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { setSession } from "@/server/auth/sessions"
import { db } from "@/server/db/client"
import { usersTable } from "@/server/db/schema"
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
				"Signup failed. Check your credentials or try another email address."
			)
		}

		const { feedback } = checkPasswordStrength(data.password)

		if (feedback.warning) {
			throw new Error(feedback.warning)
		}

		const checkForPasswordLeaks = await checkPasswordLeaks(data.password)

		if (checkForPasswordLeaks) {
			throw new Error("This password has been leaked in a data breach")
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
			throw new Error("Failed to create user")
		}

		await setSession({ userId: user.id })

		throw redirect({ to: "/" })
	})

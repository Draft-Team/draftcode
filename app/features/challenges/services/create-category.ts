import { createServerFn } from "@tanstack/start"
import { z } from "zod"

import { db } from "@/server/db/client"
import { categoriesTable } from "@/server/db/schema"
import { authedMiddleware, csrfProtectionMiddleware } from "@/server/utils/middlewares"

export const $createCategory = createServerFn()
	.validator(
		z.object({
			name: z.string().min(3).max(20)
		})
	)
	.middleware([csrfProtectionMiddleware, authedMiddleware])
	.handler(async ({ data }) => {
		await db
			.insert(categoriesTable)
			.values({
				name: data.name
			})
			.onConflictDoUpdate({
				target: [categoriesTable.name],
				set: {
					name: data.name
				}
			})
	})

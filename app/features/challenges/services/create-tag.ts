import { createServerFn } from "@tanstack/start"
import { z } from "zod"

import { db } from "@/server/db/client"
import { tagsTable } from "@/server/db/schema"
import { authedMiddleware, csrfProtectionMiddleware } from "@/server/utils/middlewares"

export const $createTag = createServerFn()
	.validator(
		z.object({
			name: z.string().min(2).max(10)
		})
	)
	.middleware([csrfProtectionMiddleware, authedMiddleware])
	.handler(async ({ data }) => {
		await db
			.insert(tagsTable)
			.values({
				name: data.name
			})
			.onConflictDoUpdate({
				target: [tagsTable.name],
				set: {
					name: data.name
				}
			})
	})

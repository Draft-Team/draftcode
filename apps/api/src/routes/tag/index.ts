import { db } from "@/db/client"
import { activityLogsTable, tagsTable } from "@/db/schema"
import { adminMiddleware } from "@/middlewares/admin-middleware"
import type { ErrorResponse, SuccessResponse } from "@/types/response"
import { Hono } from "hono"
import { validator } from "hono/validator"
import { z } from "zod"

const TagSchema = z.object({
	name: z.string().min(2).max(10)
})

export const tagRouter = new Hono()
	.get("/", async (c) => {
		const tags = await db.select().from(tagsTable)
		return c.json<SuccessResponse<typeof tags>>({ success: true, data: tags })
	})
	.post(
		"/",
		adminMiddleware,
		validator("json", (value, c) => {
			const parsed = TagSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 401)
			}
			return parsed.data
		}),
		async (c) => {
			const user = c.get("user")
			const data = c.req.valid("json")

			await db.transaction(async (tx) => {
				const newTag = await tx
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
					.returning()
					.get()

				const isNew = newTag.createdAt.getTime() === newTag.updatedAt.getTime()

				await tx.insert(activityLogsTable).values({
					userId: user.id,
					entityType: "tag",
					entityId: newTag.id,
					type: isNew ? "CREATE_TAG" : "UPDATE_TAG"
				})
			})

			return c.json<SuccessResponse>({ success: true })
		}
	)

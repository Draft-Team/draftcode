import { db } from "@/db/client"
import { activityLogsTable, categoriesTable } from "@/db/schema"
import { adminMiddleware } from "@/middlewares/admin-middleware"
import type { ErrorResponse, SuccessResponse } from "@/types/response"
import { Hono } from "hono"
import { validator } from "hono/validator"
import { z } from "zod"

const CategorySchema = z.object({
	name: z.string().min(3).max(20)
})

export const categoryRouter = new Hono()
	.get("/", async (c) => {
		const categories = await db.select().from(categoriesTable)
		return c.json<SuccessResponse<typeof categories>>({ success: true, data: categories })
	})
	.post(
		"/",
		adminMiddleware,
		validator("json", (value, c) => {
			const parsed = CategorySchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 401)
			}
			return parsed.data
		}),
		async (c) => {
			const user = c.get("user")
			const data = c.req.valid("json")

			await db.transaction(async (tx) => {
				const newCategory = await tx
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
					.returning()
					.get()

				const isNew = newCategory.createdAt.getTime() === newCategory.updatedAt.getTime()

				await tx.insert(activityLogsTable).values({
					userId: user.id,
					entityType: "category",
					entityId: newCategory.id,
					type: isNew ? "CREATE_CATEGORY" : "UPDATE_CATEGORY"
				})
			})

			return c.json<SuccessResponse>({ success: true })
		}
	)

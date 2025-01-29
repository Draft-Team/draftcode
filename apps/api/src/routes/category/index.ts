import { db } from "@/db/client"
import { categoriesTable } from "@/db/schema"
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
			const data = c.req.valid("json")

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

			return c.json<SuccessResponse>({ success: true })
		}
	)

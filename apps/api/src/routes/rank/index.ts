import { db } from "@/db/client"
import { imagesEntityTable, imagesTable, profilesTable, usersTable } from "@/db/schema"
import type { SuccessResponse } from "@/types/response"
import { and, desc, eq, sql } from "drizzle-orm"
import { Hono } from "hono"

export const rankRouter = new Hono().get("/", async (c) => {
	const rankings = await db
		.select({
			name: usersTable.name,
			totalExperience: profilesTable.totalExperience,
			email: usersTable.email,
			imageUrl: imagesTable.url,
			rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${profilesTable.totalExperience} DESC)`.as(
				"rank"
			)
		})
		.from(usersTable)
		.leftJoin(profilesTable, eq(usersTable.id, profilesTable.userId))
		.leftJoin(
			imagesEntityTable,
			and(
				eq(profilesTable.id, imagesEntityTable.entityId),
				eq(imagesEntityTable.entityType, "profile")
			)
		)
		.leftJoin(imagesTable, eq(imagesEntityTable.imageId, imagesTable.id))
		.orderBy(desc(profilesTable.totalExperience))
		.all()

	return c.json<SuccessResponse<typeof rankings>>({ success: true, data: rankings })
})

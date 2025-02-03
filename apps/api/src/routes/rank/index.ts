import { db } from "@/db/client"
import { imagesEntityTable, imagesTable, profilesTable, usersTable } from "@/db/schema"
import type { SuccessResponse } from "@/types/response"
import { desc, eq, sql } from "drizzle-orm"
import { Hono } from "hono"

export const rankRouter = new Hono().get("/", async (c) => {
	const profileImage = db
		.select({
			profileId: imagesEntityTable.entityId,
			url: sql<string>`MIN(${imagesTable.url})`.as("url")
		})
		.from(imagesEntityTable)
		.leftJoin(imagesTable, eq(imagesEntityTable.imageId, imagesTable.id))
		.where(eq(imagesEntityTable.entityType, "profile"))
		.groupBy(imagesEntityTable.entityId)
		.as("profile_image")

	const rankings = await db
		.select({
			name: usersTable.name,
			email: usersTable.email,
			totalExperience: profilesTable.totalExperience,
			imageUrl: profileImage.url,
			rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${profilesTable.totalExperience} DESC)`.as(
				"rank"
			)
		})
		.from(usersTable)
		.leftJoin(profilesTable, eq(usersTable.id, profilesTable.userId))
		.leftJoin(profileImage, eq(profilesTable.id, profileImage.profileId))
		.orderBy(desc(profilesTable.totalExperience))
		.all()

	return c.json<SuccessResponse<typeof rankings>>({ success: true, data: rankings })
})

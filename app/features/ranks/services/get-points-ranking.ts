import { createServerFn } from "@tanstack/start"
import { and, desc, eq, sql } from "drizzle-orm"

import { db } from "@/server/db/client"
import {
	imagesEntityTable,
	imagesTable,
	profilesTable,
	usersTable
} from "@/server/db/schema"

export const $getPointsRanking = createServerFn().handler(async () => {
	const rankings = await db
		.select({
			name: usersTable.name,
			totalExperience: profilesTable.totalExperience,
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

	return rankings
})

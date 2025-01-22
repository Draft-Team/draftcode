import { createServerFn } from "@tanstack/start"
import { and, eq } from "drizzle-orm"

import { db } from "@/server/db/client"
import {
	categoriesTable,
	challengeCategoriesTable,
	challengeResourcesTable,
	challengesTable,
	challengeTagsTable,
	imagesEntityTable,
	imagesTable,
	tagsTable
} from "@/server/db/schema"

export const $getChallenges = createServerFn().handler(async () => {
	const challenges = await db
		.select({
			challenge: challengesTable,
			tag: tagsTable,
			category: categoriesTable,
			resource: challengeResourcesTable,
			coverImage: imagesTable.url
		})
		.from(challengesTable)
		.leftJoin(challengeTagsTable, eq(challengesTable.id, challengeTagsTable.challengeId))
		.leftJoin(tagsTable, eq(challengeTagsTable.tagId, tagsTable.id))
		.leftJoin(
			challengeCategoriesTable,
			eq(challengesTable.id, challengeCategoriesTable.challengeId)
		)
		.leftJoin(
			categoriesTable,
			eq(challengeCategoriesTable.categoryId, categoriesTable.id)
		)
		.leftJoin(
			challengeResourcesTable,
			eq(challengesTable.id, challengeResourcesTable.challengeId)
		)
		.leftJoin(
			imagesEntityTable,
			and(
				eq(imagesEntityTable.entityId, challengesTable.id),
				eq(imagesEntityTable.entityType, "challenge")
			)
		)
		.leftJoin(
			imagesTable,
			and(
				eq(imagesEntityTable.imageId, imagesTable.id),
				eq(imagesTable.type, "challenge-cover")
			)
		)

	const challengesMap = new Map<
		string,
		{
			challenge: typeof challengesTable.$inferSelect
			tags: (typeof tagsTable.$inferSelect)[]
			categories: (typeof categoriesTable.$inferSelect)[]
			resources: (typeof challengeResourcesTable.$inferSelect)[]
			coverImage: string | null
		}
	>()

	challenges.forEach((row) => {
		const challengeId = row.challenge.id

		if (!challengesMap.has(challengeId)) {
			challengesMap.set(challengeId, {
				challenge: row.challenge,
				tags: [],
				categories: [],
				resources: [],
				coverImage: row.coverImage
			})
		}

		const current = challengesMap.get(challengeId)!

		if (row.tag && !current.tags.some((t) => t.id === row.tag?.id)) {
			current.tags.push(row.tag)
		}

		if (row.category && !current.categories.some((c) => c.id === row.category?.id)) {
			current.categories.push(row.category)
		}

		if (row.resource && !current.resources.some((r) => r.id === row.resource?.id)) {
			current.resources.push(row.resource)
		}

		if (row.coverImage && !current.coverImage) {
			current.coverImage = row.coverImage
		}
	})

	return Array.from(challengesMap.values())
})

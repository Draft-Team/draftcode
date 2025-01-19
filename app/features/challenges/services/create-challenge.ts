import { createServerFn } from "@tanstack/start"
import { z } from "zod"

import { db } from "@/server/db/client"
import {
	challengeCategoriesTable,
	challengesTable,
	challengeTagsTable
} from "@/server/db/schema"

export const $createChallenge = createServerFn()
	.validator(
		z.object({
			title: z.string().min(5).max(50),
			tagsId: z.array(z.string().min(1).max(50)),
			description: z.string().min(10).max(500),
			difficulty: z.union([
				z.literal("easy"),
				z.literal("medium"),
				z.literal("hard"),
				z.literal("expert")
			]),
			categoryId: z.string().min(1).max(50)
		})
	)
	.handler(async ({ data }) => {
		return await db.transaction(async (tx) => {
			const newChallenge = await tx
				.insert(challengesTable)
				.values({
					title: data.title,
					difficulty: data.difficulty,
					description: data.description,
					status: "published",
					blocks: "",
					experienceForCompletion: 1000
				})
				.returning()
				.get()

			await tx
				.insert(challengeCategoriesTable)
				.values({
					challengeId: newChallenge.id,
					categoryId: data.categoryId
				})
				.execute()

			for (const tag of data.tagsId) {
				await tx
					.insert(challengeTagsTable)
					.values({
						challengeId: newChallenge.id,
						tagId: tag
					})
					.execute()
			}

			return {
				challengeId: newChallenge.id
			}
		})
	})

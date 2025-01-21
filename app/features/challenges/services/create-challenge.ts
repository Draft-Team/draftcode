import { createServerFn } from "@tanstack/start"
import { z } from "zod"

import { db } from "@/server/db/client"
import {
	challengeCategoriesTable,
	challengeResourcesTable,
	challengesTable,
	challengeTagsTable
} from "@/server/db/schema"
import { adminMiddleware, csrfProtectionMiddleware } from "@/server/utils/middlewares"

const BlockSchemas = {
	text: z.object({
		type: z.literal("text"),
		content: z.object({
			text: z.string().min(1)
		})
	}),
	figma: z.object({
		type: z.literal("figma"),
		content: z.object({
			url: z.string().url()
		})
	})
}

export const $createChallenge = createServerFn()
	.validator(
		z.object({
			title: z.string().min(5).max(50),
			tagsId: z.array(z.string()),
			description: z.string().min(10).max(500),
			blocks: z.array(z.union([BlockSchemas.text, BlockSchemas.figma])).nonempty(),
			difficulty: z.enum(["easy", "medium", "hard", "expert"]),
			status: z.enum(["draft", "published", "archived"]),
			categoryId: z.string(),
			experienceForCompletion: z.number().int().min(1),
			resources: z
				.array(
					z.object({
						title: z.string().min(5).max(50),
						description: z.string().min(10).max(500),
						type: z.enum(["documentation", "tutorial"]),
						url: z.string().url()
					})
				)
				.optional()
		})
	)
	.middleware([csrfProtectionMiddleware, adminMiddleware])
	.handler(async ({ data }) => {
		return await db.transaction(async (tx) => {
			const newChallenge = await tx
				.insert(challengesTable)
				.values({
					title: data.title,
					blocks: data.blocks,
					status: data.status,
					difficulty: data.difficulty,
					description: data.description,
					experienceForCompletion: data.experienceForCompletion
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

			if (data.resources) {
				for (const resource of data.resources) {
					await tx
						.insert(challengeResourcesTable)
						.values({
							challengeId: newChallenge.id,
							title: resource.title,
							description: resource.description,
							type: resource.type,
							url: resource.url
						})
						.execute()
				}
			}

			return {
				challengeId: newChallenge.id
			}
		})
	})

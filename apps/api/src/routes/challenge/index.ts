import { db } from "@/db/client"
import {
	categoriesTable,
	challengeCategoriesTable,
	challengeResourcesTable,
	challengesTable,
	challengeTagsTable,
	imagesEntityTable,
	imagesTable,
	tagsTable
} from "@/db/schema"
import { adminMiddleware } from "@/middlewares/admin-middleware"
import type { ErrorResponse, SuccessResponse } from "@/types/response"
import { and, eq } from "drizzle-orm"
import { Hono } from "hono"
import { validator } from "hono/validator"
import { z } from "zod"

const BlockSchemas = {
	text: z.object({
		type: z.literal("text"),
		content: z.object({
			text: z.string().min(10).max(100)
		})
	}),
	figma: z.object({
		type: z.literal("figma"),
		content: z.object({
			url: z.string().url()
		})
	})
}

const ChallengeSchema = z.object({
	title: z.string().min(5).max(50),
	tagsId: z.array(z.string()),
	description: z.string().min(10).max(500),
	blocks: z.array(z.union([BlockSchemas.text, BlockSchemas.figma])).min(1),
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

export const challengeRouter = new Hono()
	.get("/", async (c) => {
		const challenges = await db
			.select({
				challenge: challengesTable,
				tag: tagsTable,
				category: categoriesTable,
				resource: challengeResourcesTable,
				coverImage: imagesTable.url
			})
			.from(challengesTable)
			.leftJoin(
				challengeTagsTable,
				eq(challengesTable.id, challengeTagsTable.challengeId)
			)
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

		for (const row of challenges) {
			const challengeId = row.challenge.id

			let current = challengesMap.get(challengeId)
			if (!current) {
				current = {
					challenge: row.challenge,
					tags: [],
					categories: [],
					resources: [],
					coverImage: row.coverImage
				}
				challengesMap.set(challengeId, current)
			}

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
		}

		const challengesFormatted = Array.from(challengesMap.values())

		const groupedChallenges = challengesFormatted.reduce(
			(acc, value) => {
				const status = value.challenge.status
				if (status === "draft") acc.draft.push(value)
				if (status === "published") acc.published.push(value)
				if (status === "archived") acc.archived.push(value)
				return acc
			},
			{
				draft: [] as typeof challengesFormatted,
				published: [] as typeof challengesFormatted,
				archived: [] as typeof challengesFormatted
			}
		)

		return c.json<SuccessResponse<typeof groupedChallenges>>({
			success: true,
			data: groupedChallenges
		})
	})
	.post(
		"/",
		adminMiddleware,
		validator("json", (value, c) => {
			const parsed = ChallengeSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 401)
			}
			return parsed.data
		}),
		async (c) => {
			const data = c.req.valid("json")

			const newChallenge = await db.transaction(async (tx) => {
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

			return c.json<SuccessResponse<{ challengeId: string }>>({
				success: true,
				data: {
					challengeId: newChallenge.challengeId
				}
			})
		}
	)

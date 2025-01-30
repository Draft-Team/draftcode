import { getCurrentUserProfile } from "@/auth/sessions"
import { db } from "@/db/client"
import type { DBTypes } from "@/db/db-types"
import { profileLinksTable, profilesTable, usersTable } from "@/db/schema"
import { authedMiddleware } from "@/middlewares/authed-middleware"
import type { ErrorResponse, SuccessResponse } from "@/types/response"
import { and, eq, inArray, sql } from "drizzle-orm"
import { Hono } from "hono"
import { validator } from "hono/validator"

import { z } from "zod"

const validatePlatformUrl = (platform: string) => {
	const platformValidators: Record<string, RegExp> = {
		github: /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+(\/[\w-]+)*\/?$/,
		linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+(\/[\w-]+)*\/?$/,
		twitch: /^(https?:\/\/)?(www\.)?twitch\.tv\/[\w-]+(\/[\w-]+)*\/?$/,
		youtube: /^(https:\/\/www\.youtube\.com\/@[\w-]+(\/[\w-]+)*\/?$)/,
		website: /^(https:\/\/)[\w.-]+\.[a-z]{2,6}(\/[\w-]*)*\/?$/
	}

	return platformValidators[platform] ?? /^https?:\/\/.+/
}

export const ProfileSchema = z.object({
	profileCover: z.custom<FileList | undefined>(),
	profileAvatar: z.custom<FileList | undefined>(),
	name: z.string().min(2).max(100),
	bio: z.string().min(3).max(255).optional().nullable(),
	githubUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("github").test(url)),
	linkedinUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("linkedin").test(url)),
	twitchUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("twitch").test(url)),
	youtubeUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("youtube").test(url)),
	websiteUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("website").test(url))
})

type ProfileLinkType = DBTypes["profileLinksTable"]["type"]

export const profileRouter = new Hono()
	.get("/", async (c) => {
		const profile = await getCurrentUserProfile()

		return c.json<SuccessResponse<typeof profile | null>>({
			success: true,
			data: profile
		})
	})
	.post(
		"/edit",
		authedMiddleware,
		validator("json", (value, c) => {
			const parsed = ProfileSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 401)
			}
			return parsed.data
		}),
		async (c) => {
			const data = c.req.valid("json")

			const user = c.var.user

			await db.transaction(async (tx) => {
				await tx
					.update(usersTable)
					.set({ name: data.name })
					.where(eq(usersTable.id, user.id))

				const profile = await tx
					.update(profilesTable)
					.set({ bio: data.bio })
					.where(eq(profilesTable.userId, user.id))
					.returning()
					.get()

				const linkMap: Record<ProfileLinkType, string | undefined> = {
					github: data.githubUrl,
					linkedin: data.linkedinUrl,
					twitch: data.twitchUrl,
					website: data.websiteUrl,
					youtube: data.youtubeUrl
				}

				const emptyTypes = Object.entries(linkMap)
					.filter(([_, url]) => !url)
					.map(([type]) => type as ProfileLinkType)

				if (emptyTypes.length > 0) {
					await tx
						.delete(profileLinksTable)
						.where(
							and(
								eq(profileLinksTable.profileId, profile.id),
								inArray(profileLinksTable.type, emptyTypes)
							)
						)
				}

				const validLinks = Object.entries(linkMap)
					.filter((entry): entry is [ProfileLinkType, string] => !!entry[1])
					.map(([type, url]) => ({
						type,
						url,
						profileId: profile.id
					}))

				if (validLinks.length > 0) {
					await tx
						.insert(profileLinksTable)
						.values(validLinks)
						.onConflictDoUpdate({
							target: [profileLinksTable.profileId, profileLinksTable.type],
							set: { url: sql`excluded.url` }
						})
				}
			})

			return c.json<SuccessResponse>({ success: true })
		}
	)

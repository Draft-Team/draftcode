import { createServerFn } from "@tanstack/start"
import { and, eq, inArray, sql } from "drizzle-orm"

import { db } from "@/server/db/client"
import type { DBTypes } from "@/server/db/db-types"
import { profileLinksTable, profilesTable, usersTable } from "@/server/db/schema"
import { authedMiddleware, csrfProtectionMiddleware } from "@/server/utils/middlewares"

import { ProfileSchema } from "../schemas/profile-schema"

type ProfileLinkType = DBTypes["profileLinksTable"]["type"]

export const $editprofile = createServerFn({ method: "POST" })
	.middleware([csrfProtectionMiddleware, authedMiddleware])
	.validator(ProfileSchema)
	.handler(async ({ data, context }) => {
		await db.transaction(async (tx) => {
			await tx
				.update(usersTable)
				.set({ name: data.name })
				.where(eq(usersTable.id, context.user.id))

			const profile = await tx
				.update(profilesTable)
				.set({ bio: data.bio })
				.where(eq(profilesTable.userId, context.user.id))
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
	})

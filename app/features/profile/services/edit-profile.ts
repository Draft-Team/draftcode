import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"

import { db } from "@/server/db/client"
import type { DBTypes } from "@/server/db/db-types"
import { profileLinksTable, profilesTable } from "@/server/db/schema"
import { authedMiddleware } from "@/server/utils/middlewares"

import { ProfileSchema } from "../schemas/profile-schema"

export const $editprofile = createServerFn({ method: "POST" })
	.middleware([authedMiddleware])
	.validator(ProfileSchema)
	.handler(async ({ data, context }) => {
		await db.transaction(async (tx) => {
			const profileUpdated = await tx
				.update(profilesTable)
				.set({ bio: data.bio })
				.where(eq(profilesTable.userId, context.user.id))
				.returning()
				.get()

			const profileLinksData: Omit<DBTypes["profileLinksTable"], "id" | "profileId">[] = [
				{ type: "github", url: data.githubUrl ?? "" },
				{ type: "linkedin", url: data.linkedinUrl ?? "" },
				{ type: "twitch", url: data.twitchUrl ?? "" },
				{ type: "website", url: data.websiteUrl ?? "" },
				{ type: "youtube", url: data.youtubeUrl ?? "" }
			]

			const linksToUpsert = profileLinksData
				.filter((link): link is Required<typeof link> => !!link.url && !!link.type)
				.map((link) => ({
					...link,
					profileId: profileUpdated.id
				}))

			for (const link of linksToUpsert) {
				await tx
					.insert(profileLinksTable)
					.values(link)
					.onConflictDoUpdate({
						target: [profileLinksTable.profileId, profileLinksTable.type],
						set: { url: link.url }
					})
			}
		})
	})

import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"

import { ProfileSchema } from "@/features/profile/schemas/profile-schema"
import type { SocialPlatform } from "@/routes/_base.profile.edit"
import { db } from "@/server/db/client"
import { profileLinksTable, profilesTable } from "@/server/db/schema"
import { authedMiddleware } from "@/server/utils/middlewares"

export const $editprofile = createServerFn({ method: "POST" })
	.middleware([authedMiddleware])
	.validator(ProfileSchema)
	.handler(async ({ data, context }) => {
		const updatedProfile = await db
			.update(profilesTable)
			.set({ bio: data.bio })
			.where(eq(profilesTable.userId, context.user.id))
			.returning()
			.get()

		if (!updatedProfile) {
			throw new Error("Perfil não encontrado ou erro ao atualizar")
		}

		await db
			.delete(profileLinksTable)
			.where(eq(profileLinksTable.profileId, updatedProfile.id))

		const socialLinks = [
			{ platform: "github", url: data.githubUrl },
			{ platform: "linkedin", url: data.linkedinUrl },
			{ platform: "twitch", url: data.twitchUrl },
			{ platform: "youtube", url: data.youtubeUrl },
			{ platform: "website", url: data.websiteUrl }
		]

		const activeLinks = socialLinks
			.filter((link) => link.url && link.url.trim() !== "")
			.map((link) => ({
				profileId: updatedProfile.id,
				type: link.platform as SocialPlatform,
				url: link.url!
			}))

		if (activeLinks.length > 0) {
			await db.insert(profileLinksTable).values(activeLinks)
		}

		return { message: "Perfil atualizado com sucesso" }
	})

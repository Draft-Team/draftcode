import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"

import { ProfileSchema } from "@/features/profile/pages/profile-edit/schemas/profile-schema"
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

		if (data.githubUrl) {
			await db
				.insert(profileLinksTable)
				.values({ type: "github", url: data.githubUrl, profileId: updatedProfile.id })
		}
		if (data.linkedinUrl) {
			await db
				.insert(profileLinksTable)
				.values({ type: "linkedin", url: data.linkedinUrl, profileId: updatedProfile.id })
		}
		if (data.twitchUrl) {
			await db
				.insert(profileLinksTable)
				.values({ type: "twitch", url: data.twitchUrl, profileId: updatedProfile.id })
		}
		if (data.websiteUrl) {
			await db
				.insert(profileLinksTable)
				.values({ type: "website", url: data.websiteUrl, profileId: updatedProfile.id })
		}
		if (data.youtubeUrl) {
			await db
				.insert(profileLinksTable)
				.values({ type: "youtube", url: data.youtubeUrl, profileId: updatedProfile.id })
		}

		return { message: "Perfil atualizado com sucesso" }
	})

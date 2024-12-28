import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"

import { getCurrentSession, getCurrentUser } from "@/server/auth/sessions"
import { db } from "@/server/db/client"
import { imagesTable, profileImagesTable, profilesTable } from "@/server/db/schema"
import { authedMiddleware } from "@/server/utils/middlewares"

export const authQueryKeys = {
	userProfile: ["userProfile"] as const,
	currentUser: ["currentUser"] as const,
	currentSession: ["currentSession"] as const
}

const $getCurrentUser = createServerFn().handler(async () => {
	return await getCurrentUser()
})

const $getCurrentSession = createServerFn().handler(async () => {
	return await getCurrentSession()
})

const $getUserProfile = createServerFn()
	.middleware([authedMiddleware])
	.handler(async ({ context }) => {
		return await db.transaction(async (tx) => {
			const profile = await tx
				.select({
					id: profilesTable.id,
					bio: profilesTable.bio,
					totalExperience: profilesTable.totalExperience
				})
				.from(profilesTable)
				.where(eq(profilesTable.userId, context.user.id))
				.get()

			if (!profile) {
				throw new Error("Profile not found")
			}

			const profileImage = await tx
				.select({
					id: imagesTable.id,
					key: imagesTable.key,
					url: imagesTable.url,
					type: imagesTable.type
				})
				.from(imagesTable)
				.innerJoin(profileImagesTable, eq(imagesTable.id, profileImagesTable.imageId))
				.where(eq(profileImagesTable.profileId, profile.id))

			return {
				profile: {
					...profile,
					images: profileImage
				}
			}
		})
	})

export const currentUserQueryOptions = queryOptions({
	queryKey: authQueryKeys.currentUser,
	queryFn: async () => {
		const user = await $getCurrentUser()
		return user ?? null
	}
})

export const currentSessionQueryOptions = queryOptions({
	queryKey: authQueryKeys.currentSession,
	queryFn: async () => {
		const session = await $getCurrentSession()
		return session ?? null
	}
})

export const userProfileQueryOptions = queryOptions({
	queryKey: authQueryKeys.userProfile,
	queryFn: async () => {
		const profile = await $getUserProfile()
		return profile ?? null
	}
})

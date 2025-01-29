import { eq } from "drizzle-orm"
import { createUploadthing, UploadThingError, UTApi } from "uploadthing/server"
import type { FileRouter } from "uploadthing/server"
import { z } from "zod"

import { getCurrentUserProfile } from "../auth/sessions"
import { db } from "../db/client"
import type { DBTypes } from "../db/db-types"
import { challengesTable, imagesEntityTable, imagesTable } from "../db/schema"

const utapi = new UTApi()
const f = createUploadthing()

interface ImageUploadMetadata {
	entityId: string
	currentImage?: {
		id: string
		key: string | null
		type: DBTypes["imagesTable"]["type"]
	}
}

const IMAGE_CONFIG = {
	maxFileSize: "2MB",
	maxFileCount: 1
} as const

const handleImageUpload = async ({
	metadata,
	file,
	imageType,
	entityType
}: {
	metadata: ImageUploadMetadata
	file: { key: string; url: string }
	imageType: DBTypes["imagesTable"]["type"]
	entityType: DBTypes["imagesEntityTable"]["entityType"]
}) => {
	const { currentImage, entityId } = metadata

	if (currentImage?.key) {
		await utapi.deleteFiles([currentImage.key])
	}

	return db.transaction(async (tx) => {
		if (currentImage) {
			return tx
				.update(imagesTable)
				.set({ key: file.key, url: file.url, type: imageType })
				.where(eq(imagesTable.id, currentImage.id))
		}

		const image = await tx
			.insert(imagesTable)
			.values({
				type: imageType,
				url: file.url,
				key: file.key
			})
			.returning()
			.get()

		await tx.insert(imagesEntityTable).values({
			imageId: image.id,
			entityId,
			entityType
		})

		return image
	})
}

const getProfileImageMiddleware = async (imageType: DBTypes["imagesTable"]["type"]) => {
	const profile = await getCurrentUserProfile()
	if (!profile) throw new UploadThingError("Unauthorized")

	const currentImage = profile.images.find((image) => image.type === imageType)
	return { entityId: profile.id, currentImage }
}

const getChallengeImageMiddleware = async (challengeId: string) => {
	const challenge = await db
		.select({
			images: {
				id: imagesTable.id,
				key: imagesTable.key,
				type: imagesTable.type,
				url: imagesTable.url
			}
		})
		.from(challengesTable)
		.innerJoin(imagesEntityTable, eq(imagesEntityTable.entityId, challengeId))
		.innerJoin(imagesTable, eq(imagesEntityTable.imageId, imagesTable.id))
		.where(eq(challengesTable.id, challengeId))

	if (!challenge) throw new UploadThingError("Challenge not found")

	const currentImage = challenge
		.map(({ images }) => images)
		.find((image) => image.type === "challenge-cover")
	return { entityId: challengeId, currentImage }
}

export const uploadRouter = {
	profileCover: f({ image: IMAGE_CONFIG })
		.middleware(async () => getProfileImageMiddleware("profile-cover"))
		.onUploadComplete(async ({ metadata, file }) => {
			await handleImageUpload({
				file,
				metadata,
				imageType: "profile-cover",
				entityType: "profile"
			})
		}),

	profileAvatar: f({ image: IMAGE_CONFIG })
		.middleware(async () => getProfileImageMiddleware("profile-avatar"))
		.onUploadComplete(async ({ metadata, file }) => {
			await handleImageUpload({
				file,
				metadata,
				imageType: "profile-avatar",
				entityType: "profile"
			})
		}),

	challengeCover: f({ image: IMAGE_CONFIG })
		.input(z.object({ challengeId: z.string() }))
		.middleware(async ({ input }) => getChallengeImageMiddleware(input.challengeId))
		.onUploadComplete(async ({ metadata, file }) => {
			await handleImageUpload({
				file,
				metadata,
				imageType: "challenge-cover",
				entityType: "challenge"
			})
		})
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter

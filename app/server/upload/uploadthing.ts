import { eq } from "drizzle-orm"
import { createUploadthing, UploadThingError, UTApi } from "uploadthing/server"
import type { FileRouter } from "uploadthing/server"

import { getCurrentUserProfile } from "../auth/sessions"
import { db } from "../db/client"
import type { DBTypes } from "../db/db-types"
import { imagesEntityTable, imagesTable } from "../db/schema"

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
	maxFileSize: "4MB",
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
	return db.transaction(async (tx) => {
		const { currentImage, entityId } = metadata

		if (currentImage?.key) {
			await utapi.deleteFiles([currentImage.key])
			return tx
				.update(imagesTable)
				.set({ key: file.key, url: file.url, type: imageType })
				.where(eq(imagesTable.id, currentImage.id))
		}

		if (currentImage) {
			await tx.delete(imagesTable).where(eq(imagesTable.id, currentImage.id))
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
		})
} satisfies FileRouter

export type UploadRouter = typeof uploadRouter

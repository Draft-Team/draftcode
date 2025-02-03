import { Hono } from "hono"
import { validator } from "hono/validator"
import sharp from "sharp"
import { encodeBase64 } from "hono/utils/encode"
import { v2 as cloudinary } from "cloudinary"

import type { ErrorResponse, SuccessResponse } from "@/types/response"
import type { DBTypes } from "@/db/db-types"
import { z } from "zod"
import { db } from "@/db/client"
import { challengesTable, imagesEntityTable, imagesTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getCurrentUserProfile } from "@/auth/sessions"

type ImageType = DBTypes["imagesTable"]["type"]
type EntityType = DBTypes["imagesEntityTable"]["entityType"]

interface ImageUploadMetadata {
	entityId: string
	currentImage?: {
		id: string
		key: string | null
		type: ImageType
	}
}

const IMAGE_SIZES = {
	"profile-avatar": {
		width: 96,
		height: 96
	},
	"profile-cover": {
		width: 1024,
		height: 256
	},
	"challenge-cover": {
		width: 1024,
		height: 256
	}
} as const

const BaseImageSchema = z.object({
	file: z.custom<File>()
})

const ChallengeImageSchema = BaseImageSchema.extend({
	challengeId: z.string()
})

const validateImageSize = async (file: File, type: keyof typeof IMAGE_SIZES) => {
	const metadata = await sharp(Buffer.from(await file.arrayBuffer())).metadata()

	if (!metadata?.width || !metadata?.height) {
		throw new Error("Erro ao processar a imagem")
	}

	const expectedSize = IMAGE_SIZES[type]
	if (metadata.width < expectedSize.width || metadata.height < expectedSize.height) {
		throw new Error(
			`Imagem deve ter no mínimo ${expectedSize.width}x${expectedSize.height}`
		)
	}
}

const uploadToCloudinary = async (file: File) => {
	const byteArrayBuffer = await file.arrayBuffer()
	const base64 = encodeBase64(byteArrayBuffer)

	return cloudinary.uploader.upload(`data:${file.type};base64,${base64}`, {
		folder: "draftcode-images",
		format: "webp",
		transformation: {
			quality: 100
		}
	})
}

const handleImageUpload = async ({
	metadata,
	file,
	imageType,
	entityType
}: {
	metadata: ImageUploadMetadata
	file: { key: string; url: string }
	imageType: ImageType
	entityType: EntityType
}) => {
	const { currentImage, entityId } = metadata

	if (currentImage?.key) {
		await cloudinary.uploader.destroy(currentImage.key)
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

const getProfileImageMetadata = async (imageType: ImageType) => {
	const profile = await getCurrentUserProfile()
	if (!profile) throw new Error("Unauthorized")

	const currentImage = profile.images.find((image) => image.type === imageType)
	return { entityId: profile.id, currentImage }
}

const getChallengeImageMetadata = async (challengeId: string) => {
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

	if (!challenge) throw new Error("Desafio não encontrado")

	const currentImage = challenge
		.map(({ images }) => images)
		.find((image) => image.type === "challenge-cover")

	return { entityId: challengeId, currentImage }
}

export const uploadRouter = new Hono()
	.post(
		"/profile/avatar",
		validator("form", (value, c) => {
			const parsed = BaseImageSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 400)
			}
			return parsed.data
		}),
		async (c) => {
			const { file } = c.req.valid("form")

			await validateImageSize(file, "profile-avatar")

			const { public_id, secure_url } = await uploadToCloudinary(file)
			const metadata = await getProfileImageMetadata("profile-avatar")

			await handleImageUpload({
				metadata,
				file: { key: public_id, url: secure_url },
				imageType: "profile-avatar",
				entityType: "profile"
			})

			return c.json<SuccessResponse>({ success: true })
		}
	)
	.post(
		"/profile/cover",
		validator("form", (value, c) => {
			const parsed = BaseImageSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 400)
			}
			return parsed.data
		}),
		async (c) => {
			const { file } = c.req.valid("form")

			await validateImageSize(file, "profile-cover")

			const { public_id, secure_url } = await uploadToCloudinary(file)
			const metadata = await getProfileImageMetadata("profile-cover")

			await handleImageUpload({
				metadata,
				file: { key: public_id, url: secure_url },
				imageType: "profile-cover",
				entityType: "profile"
			})

			return c.json<SuccessResponse>({ success: true })
		}
	)
	.post(
		"/challenge/cover",
		validator("form", (value, c) => {
			const parsed = ChallengeImageSchema.safeParse(value)
			if (!parsed.success) {
				return c.json<ErrorResponse>({ error: parsed.error.message, success: false }, 400)
			}
			return parsed.data
		}),
		async (c) => {
			const { file, challengeId } = c.req.valid("form")

			await validateImageSize(file, "challenge-cover")

			const { public_id, secure_url } = await uploadToCloudinary(file)
			const metadata = await getChallengeImageMetadata(challengeId)

			await handleImageUpload({
				metadata,
				file: { key: public_id, url: secure_url },
				imageType: "challenge-cover",
				entityType: "challenge"
			})

			return c.json<SuccessResponse>({ success: true })
		}
	)

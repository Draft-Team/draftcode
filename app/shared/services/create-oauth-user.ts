import { db } from "@/server/db/client"
import { type DBTypes } from "@/server/db/db-types"
import {
	imagesEntityTable,
	imagesTable,
	oauthAccountsTable,
	profilesTable,
	usersTable
} from "@/server/db/schema"

interface CreateOAuthUserProps {
	name: string
	email: string
	avatarUrl: string
	providerUserId: string
	providerId: DBTypes["oauthAccountsTable"]["providerId"]
}

export const createOAuthUser = async (props: CreateOAuthUserProps) => {
	return await db.transaction(async (tx) => {
		const newOAuthUser = await tx
			.insert(usersTable)
			.values({
				role: "user",
				name: props.name,
				email: props.email
			})
			.returning()
			.get()

		await tx.insert(oauthAccountsTable).values({
			providerId: props.providerId,
			providerUserId: props.providerUserId,
			userId: newOAuthUser.id
		})

		const profile = await tx
			.insert(profilesTable)
			.values({
				userId: newOAuthUser.id
			})
			.returning()
			.get()

		const images = await tx
			.insert(imagesTable)
			.values({
				type: "profile-avatar",
				url: props.avatarUrl
			})
			.returning()
			.get()

		await tx.insert(imagesEntityTable).values({
			imageId: images.id,
			entityId: profile.id,
			entityType: "profile"
		})

		return newOAuthUser
	})
}

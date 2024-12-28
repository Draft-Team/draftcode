import {
	customType,
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from "drizzle-orm/sqlite-core"

import { generateId } from "../utils/generate-id"

export type OauthProviderId = "github" | "google"
export type UserRole = "user" | "admin" | "superadmin"
export type ChallengeStatus = "draft" | "published" | "archived"
export type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert"
export type ImageType = "profile-avatar" | "profile-cover" | "challenge-cover"
export type ProfileLinkType = "github" | "linkedin" | "twitch" | "youtube" | "website"

const oauthProviderId = customType<{ data: OauthProviderId }>({
	dataType() {
		return "github"
	}
})

const challengeDifficulty = customType<{ data: ChallengeDifficulty }>({
	dataType() {
		return "easy"
	}
})

const profileLinkType = customType<{ data: ProfileLinkType }>({
	dataType() {
		return "github"
	}
})

const challengeStatus = customType<{ data: ChallengeStatus }>({
	dataType() {
		return "draft"
	}
})

const userRole = customType<{ data: UserRole }>({
	dataType() {
		return "user"
	}
})

const imageType = customType<{ data: ImageType }>({
	dataType() {
		return "profile"
	}
})

export const imagesTable = sqliteTable("images", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	key: text("key"),
	url: text("url").notNull(),
	type: imageType("type").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
})

export const profilesTable = sqliteTable("profiles", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	bio: text("bio"),
	userId: text("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),
	totalExperience: integer("total_experience")
		.notNull()
		.$defaultFn(() => 0),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
})

export const profileLinksTable = sqliteTable("profile_links", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	type: profileLinkType("type").notNull(),
	url: text("url").notNull(),
	profileId: text("profile_id")
		.notNull()
		.references(() => profilesTable.id, { onDelete: "cascade" })
})

export const profileImagesTable = sqliteTable("profile_images", {
	profileId: text("profile_id")
		.notNull()
		.references(() => profilesTable.id, { onDelete: "cascade" }),
	imageId: text("image_id")
		.notNull()
		.references(() => imagesTable.id, { onDelete: "cascade" })
})

export const usersTable = sqliteTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		passwordHash: text("password_hash"),
		name: text("name").notNull(),
		role: userRole("role").notNull(),
		email: text("email").unique().notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return [uniqueIndex("user_email_idx").on(table.email)]
	}
)

export const challengesTable = sqliteTable(
	"challenges",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		title: text("title").notNull(),
		description: text("description").notNull(),
		status: challengeStatus("status").notNull(),
		blocks: text("blocks", { mode: "json" }).notNull(),
		difficulty: challengeDifficulty("difficulty").notNull(),
		experienceForCompletion: integer("experience_for_completion").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return [
			index("challenge_title_idx").on(table.title),
			index("challenge_difficulty_idx").on(table.difficulty)
		]
	}
)

export const challengesImagesTable = sqliteTable("challenges_images", {
	challengeId: text("challenge_id")
		.notNull()
		.references(() => challengesTable.id, { onDelete: "cascade" }),
	imageId: text("image_id")
		.notNull()
		.references(() => imagesTable.id, { onDelete: "cascade" })
})

export const categoriesTable = sqliteTable(
	"categories",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: text("name").notNull().unique(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return [index("category_name_idx").on(table.name)]
	}
)

export const challengeCategoriesTable = sqliteTable(
	"challenge_categories",
	{
		challengeId: text("challenge_id")
			.notNull()
			.references(() => challengesTable.id, { onDelete: "cascade" }),
		categoryId: text("category_id")
			.notNull()
			.references(() => categoriesTable.id, { onDelete: "cascade" })
	},
	(table) => {
		return [
			primaryKey({ columns: [table.challengeId, table.categoryId] }),
			index("challenge_category_challenge_id_idx").on(table.challengeId),
			index("challenge_category_category_id_idx").on(table.categoryId)
		]
	}
)

export const tagsTable = sqliteTable(
	"tags",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: text("name").notNull().unique(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return [index("tag_name_idx").on(table.name)]
	}
)

export const challengeTagsTable = sqliteTable(
	"challenge_tags",
	{
		challengeId: text("challenge_id")
			.notNull()
			.references(() => challengesTable.id, { onDelete: "cascade" }),
		tagId: text("tag_id")
			.notNull()
			.references(() => tagsTable.id, { onDelete: "cascade" })
	},
	(table) => {
		return [
			primaryKey({ columns: [table.challengeId, table.tagId] }),
			index("challenge_tag_challenge_id_idx").on(table.challengeId),
			index("challenge_tag_tag_id_idx").on(table.tagId)
		]
	}
)

export const oauthAccountsTable = sqliteTable(
	"oauth_accounts",
	{
		providerUserId: text("provider_user_id").notNull(),
		providerId: oauthProviderId("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
			.$onUpdate(() => new Date())
	},
	(table) => {
		return [
			primaryKey({ columns: [table.providerId, table.providerUserId] }),
			index("oauth_account_provider_user_id_idx").on(table.providerUserId),
			index("oauth_account_user_id_idx").on(table.userId)
		]
	}
)

export const sessionsTable = sqliteTable(
	"sessions",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull()
	},
	(table) => {
		return [
			index("session_user_id_idx").on(table.userId),
			index("session_expires_at_idx").on(table.expiresAt)
		]
	}
)

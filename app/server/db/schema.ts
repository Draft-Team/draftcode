import {
	index,
	integer,
	primaryKey,
	sqliteTable,
	text,
	uniqueIndex
} from "drizzle-orm/sqlite-core"

import { generateId } from "../utils/generate-id"

export const LOGS_ACTIVITY_TYPE = {
	SIGN_UP: "SIGN_UP",
	SIGN_IN: "SIGN_IN",
	SIGN_OUT: "SIGN_OUT",

	UPDATE_ACCOUNT: "UPDATE_ACCOUNT",

	UPDATE_PROFILE: "UPDATE_PROFILE",

	CREATE_CHALLENGE: "CREATE_CHALLENGE",
	UPDATE_CHALLENGE: "UPDATE_CHALLENGE",
	DELETE_CHALLENGE: "DELETE_CHALLENGE",
	CHALLENGE_COMPLETED: "CHALLENGE_COMPLETED",

	CREATE_CATEGORY: "CREATE_CATEGORY",
	UPDATE_CATEGORY: "UPDATE_CATEGORY",
	DELETE_CATEGORY: "DELETE_CATEGORY",

	CREATE_TAG: "CREATE_TAG",
	UPDATE_TAG: "UPDATE_TAG",
	DELETE_TAG: "DELETE_TAG"
} as const

type Block =
	| {
			type: "text"
			content: {
				text: string
			}
	  }
	| {
			type: "figma"
			content: {
				url: string
			}
	  }

type OauthProviderId = "github" | "google"
type ImageEntityType = "profile" | "challenge"
type UserRole = "user" | "admin" | "superadmin"
type ChallengeResourceType = "documentation" | "tutorial"
type ChallengeStatus = "draft" | "published" | "archived"
type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert"
type ImageType = "profile-avatar" | "profile-cover" | "challenge-cover"
type LogEntityType = "profile" | "challenge" | "category" | "tag" | "users"
type ProfileLinkType = "github" | "linkedin" | "twitch" | "youtube" | "website"
type ActivityType = (typeof LOGS_ACTIVITY_TYPE)[keyof typeof LOGS_ACTIVITY_TYPE]

export const activityLogsTable = sqliteTable(
	"activity_logs",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		entityType: text("entity_type").$type<LogEntityType>().notNull(),
		entityId: text("entity_id").notNull(),
		type: text("type").$type<ActivityType>().notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => {
		return [index("activity_logs_user_created_idx").on(table.userId, table.createdAt)]
	}
)

export const imagesTable = sqliteTable("images", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => generateId()),
	key: text("key"),
	url: text("url").notNull(),
	type: text("type").$type<ImageType>().notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date())
		.$onUpdate(() => new Date())
})

export const imagesEntityTable = sqliteTable(
	"images_entity",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		imageId: text("image_id")
			.notNull()
			.references(() => imagesTable.id, { onDelete: "cascade" }),
		entityId: text("entity_id").notNull(),
		entityType: text("entity_type").$type<ImageEntityType>().notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => {
		return [
			index("images_entity_image_id_idx").on(table.imageId),
			index("images_entity_entity_id_entity_type_idx").on(
				table.entityId,
				table.entityType
			),
			index("images_entity_entity_id_image_id").on(table.entityId, table.imageId)
		]
	}
)

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

export const profileLinksTable = sqliteTable(
	"profile_links",
	{
		type: text("type").$type<ProfileLinkType>().notNull(),
		url: text("url").notNull(),
		profileId: text("profile_id")
			.notNull()
			.references(() => profilesTable.id, { onDelete: "cascade" })
	},
	(table) => {
		return [
			primaryKey({ columns: [table.type, table.profileId] }),
			index("profile_links_profile_id_idx").on(table.profileId),
			index("profile_links_type_idx").on(table.type)
		]
	}
)

export const usersTable = sqliteTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		passwordHash: text("password_hash"),
		name: text("name").notNull(),
		role: text("role").$type<UserRole>().notNull(),
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
		status: text("status").$type<ChallengeStatus>().notNull(),
		blocks: text("blocks", { mode: "json" }).notNull().$type<Block[]>(),
		difficulty: text("difficulty").$type<ChallengeDifficulty>().notNull(),
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
			index("challenge_difficulty_idx").on(table.difficulty),
			index("challenge_status_difficulty_idx").on(table.status, table.difficulty)
		]
	}
)

export const userChallengeBookmarksTable = sqliteTable(
	"user_challenge_bookmarks",
	{
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		challengeId: text("challenge_id")
			.notNull()
			.references(() => challengesTable.id, { onDelete: "cascade" })
	},
	(table) => {
		return [
			primaryKey({ columns: [table.userId, table.challengeId] }),
			index("user_challenge_bookmarks_user_id_idx").on(table.userId),
			index("user_challenge_bookmarks_challenge_id_idx").on(table.challengeId)
		]
	}
)

export const challengeResourcesTable = sqliteTable(
	"challenge_resources",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		challengeId: text("challenge_id")
			.notNull()
			.references(() => challengesTable.id, { onDelete: "cascade" }),
		type: text("type").$type<ChallengeResourceType>().notNull(),
		description: text("description").notNull(),
		title: text("title").notNull(),
		url: text("url").notNull(),
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
			index("challenge_resource_type_idx").on(table.type),
			index("challenge_resource_challenge_id_idx").on(table.challengeId)
		]
	}
)

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
		providerId: text("provider_id").$type<OauthProviderId>().notNull(),
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
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.$defaultFn(() => new Date())
	},
	(table) => {
		return [
			index("session_user_id_idx").on(table.userId),
			index("session_expires_at_idx").on(table.expiresAt),
			index("session_user_id_expires_at_idx").on(table.userId, table.expiresAt)
		]
	}
)

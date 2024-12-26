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

export type OauthProviderIds = "github" | "google"
export type ChallengeDifficulty = "easy" | "medium" | "hard" | "expert"

const oauthProviderIds = customType<{ data: OauthProviderIds }>({
	dataType() {
		return "github"
	}
})

const challengeDifficulty = customType<{ data: ChallengeDifficulty }>({
	dataType() {
		return "easy"
	}
})

export const usersTable = sqliteTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		passwordHash: text("password_hash"),
		name: text("name").notNull(),
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
		title: text("name").notNull(),
		description: text("description").notNull(),
		difficulty: challengeDifficulty("difficulty").notNull(),
		experienceForCompletion: integer("experience_for_completion").notNull()
	},
	(table) => {
		return [index("challenge_title_idx").on(table.title)]
	}
)

export const tagsTable = sqliteTable(
	"tags",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => generateId()),
		name: text("name").notNull().unique()
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

export const profilesTable = sqliteTable(
	"profiles",
	{
		userId: text("user_id")
			.notNull()
			.references(() => usersTable.id, { onDelete: "cascade" }),
		totalExperience: integer("total_experience").notNull().default(0),
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
			primaryKey({ columns: [table.userId] }),
			index("profile_user_id_idx").on(table.userId),
			index("profile_total_experience_idx").on(table.totalExperience)
		]
	}
)

export const oauthAccountsTable = sqliteTable(
	"oauth_accounts",
	{
		providerUserId: text("provider_user_id").notNull(),
		providerId: oauthProviderIds("provider_id").notNull(),
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

export type TagSelect = typeof tagsTable.$inferSelect
export type TagInsert = typeof tagsTable.$inferInsert

export type UserSelect = typeof usersTable.$inferSelect
export type UserInsert = typeof usersTable.$inferInsert

export type SessionSelect = typeof sessionsTable.$inferSelect
export type SessionInsert = typeof sessionsTable.$inferInsert

export type ChallengeSelect = typeof challengesTable.$inferSelect
export type ChallengeInsert = typeof challengesTable.$inferInsert

export type UserProfileSelect = typeof profilesTable.$inferSelect
export type UserProfileInsert = typeof profilesTable.$inferInsert

export type OauthAccountSelect = typeof oauthAccountsTable.$inferSelect
export type OauthAccountInsert = typeof oauthAccountsTable.$inferInsert

export type ChallengeTagSelect = typeof challengeTagsTable.$inferSelect
export type ChallengeTagInsert = typeof challengeTagsTable.$inferInsert

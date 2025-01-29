import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { and, eq } from "drizzle-orm"
import { setCookie } from "hono/cookie"

import { env } from "@/environment/env"
import { createDate, isWithinExpirationDate, TimeSpan } from "@draftcode/utils/time-span"
import { db } from "@/db/client"
import {
	imagesEntityTable,
	imagesTable,
	profileLinksTable,
	profilesTable,
	sessionsTable,
	usersTable
} from "@/db/schema"

import type { DBTypes } from "../db/db-types"
import { getContext } from "hono/context-storage"
import type { Context } from "@/types/response"

export type Session = DBTypes["sessionsTable"]
export type User = Omit<DBTypes["usersTable"], "passwordHash">

type SessionValidationResult =
	| {
			user: User
			session: Session
	  }
	| {
			user: null
			session: null
	  }

const SESSION_DURATION = new TimeSpan(30, "d")
const RENEWAL_THRESHOLD = new TimeSpan(15, "d")

export const generateSessionToken = () => {
	const tokenBytes = new Uint8Array(20)
	crypto.getRandomValues(tokenBytes)
	const token = encodeBase32LowerCaseNoPadding(tokenBytes)
	return token
}

export const createSession = async ({
	token,
	userId
}: {
	token: string
	userId: string
}): Promise<Session> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

	const session: Session = {
		id: sessionId,
		userId,
		createdAt: new Date(),
		expiresAt: new Date(Date.now() + SESSION_DURATION.milliseconds())
	}

	await db.transaction(async (tx) => {
		await tx.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
		await tx.insert(sessionsTable).values(session)
	})

	return session
}

export const validateSessionToken = async ({
	token
}: {
	token: string
}): Promise<SessionValidationResult> => {
	if (!token) {
		return { user: null, session: null }
	}

	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

	const result = await db
		.select({
			session: sessionsTable,
			user: {
				id: usersTable.id,
				name: usersTable.name,
				role: usersTable.role,
				email: usersTable.email,
				createdAt: usersTable.createdAt,
				updatedAt: usersTable.updatedAt
			}
		})
		.from(sessionsTable)
		.leftJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
		.where(eq(sessionsTable.id, sessionId))
		.get()

	if (!result?.session || !result.user) {
		await invalidateSession({ sessionId })
		return { user: null, session: null }
	}

	const { session, user } = result

	if (!isWithinExpirationDate(result.session.expiresAt)) {
		await invalidateSession({ sessionId })
		return { user: null, session: null }
	}

	if (Date.now() >= session.expiresAt.getTime() - RENEWAL_THRESHOLD.milliseconds()) {
		const newExpiresAt = createDate(SESSION_DURATION)

		await db
			.update(sessionsTable)
			.set({ expiresAt: newExpiresAt })
			.where(eq(sessionsTable.id, sessionId))
			.execute()

		session.expiresAt = newExpiresAt
	}

	return { user, session }
}

export const invalidateSession = async ({
	sessionId
}: {
	sessionId: string
}) => {
	await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId))
}

export const invalidateUserSessions = async ({
	userId
}: {
	userId: string
}) => {
	await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId))
}

export const setSessionTokenCookie = ({
	token,
	expiresAt
}: {
	token: string
	expiresAt: Date
}) => {
	const context = getContext<Context>()

	setCookie(context, "session", token, {
		httpOnly: true,
		path: "/",
		secure: env.NODE_ENV === "production",
		sameSite: "lax",
		expires: expiresAt
	})
}

export const deleteSessionTokenCookie = () => {
	const context = getContext<Context>()

	setCookie(context, "session", "", {
		httpOnly: true,
		path: "/",
		secure: env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0
	})
}

export const getCurrentSession = async () => {
	const token = getContext<Context>().get("sessionToken")

	if (!token) {
		return null
	}

	const { session } = await validateSessionToken({ token })

	if (!session) {
		deleteSessionTokenCookie()
		return null
	}

	return session
}

export const getCurrentUser = async () => {
	const token = getContext<Context>().get("sessionToken")

	if (!token) {
		return null
	}

	const { user } = await validateSessionToken({ token })

	if (!user) {
		deleteSessionTokenCookie()
		return null
	}

	return user
}

export const getCurrentUserProfile = async () => {
	const token = getContext<Context>().get("sessionToken")

	if (!token) {
		return null
	}

	const { user } = await validateSessionToken({ token })

	if (!user) {
		deleteSessionTokenCookie()
		return null
	}

	const profile = await db
		.select({
			id: profilesTable.id,
			bio: profilesTable.bio,
			totalExperience: profilesTable.totalExperience
		})
		.from(profilesTable)
		.where(eq(profilesTable.userId, user.id))
		.get()

	if (!profile) {
		deleteSessionTokenCookie()
		return null
	}

	const profileImage = await db
		.select({
			id: imagesTable.id,
			key: imagesTable.key,
			url: imagesTable.url,
			type: imagesTable.type
		})
		.from(imagesTable)
		.innerJoin(imagesEntityTable, eq(imagesTable.id, imagesEntityTable.imageId))
		.where(
			and(
				eq(imagesEntityTable.entityId, profile.id),
				eq(imagesEntityTable.entityType, "profile")
			)
		)

	const profileLinks = await db
		.select({
			type: profileLinksTable.type,
			url: profileLinksTable.url
		})
		.from(profileLinksTable)
		.where(eq(profileLinksTable.profileId, profile.id))

	return {
		...profile,
		images: profileImage,
		links: profileLinks
	}
}

export const setSession = async ({
	userId
}: {
	userId: string
}) => {
	await invalidateUserSessions({ userId })
	deleteSessionTokenCookie()

	const token = generateSessionToken()
	const session = await createSession({ token, userId })

	if (!session) {
		throw new Error("Failed to create session")
	}

	setSessionTokenCookie({ token, expiresAt: session.expiresAt })
}

import { createServerFn } from "@tanstack/start"
import { and, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/server/db/client"
import { userChallengeBookmarksTable } from "@/server/db/schema"
import { authedMiddleware, csrfProtectionMiddleware } from "@/server/utils/middlewares"

export const $toggleBookmarkChallenge = createServerFn()
	.middleware([csrfProtectionMiddleware, authedMiddleware])
	.validator(
		z.object({
			challengeId: z.string()
		})
	)
	.handler(async ({ data, context }) => {
		const existingBookmark = await db
			.select()
			.from(userChallengeBookmarksTable)
			.where(
				and(
					eq(userChallengeBookmarksTable.userId, context.user.id),
					eq(userChallengeBookmarksTable.challengeId, data.challengeId)
				)
			)
			.get()

		if (existingBookmark) {
			await db
				.delete(userChallengeBookmarksTable)
				.where(
					and(
						eq(userChallengeBookmarksTable.userId, context.user.id),
						eq(userChallengeBookmarksTable.challengeId, data.challengeId)
					)
				)

			return
		}

		await db
			.insert(userChallengeBookmarksTable)
			.values({ userId: context.user.id, challengeId: data.challengeId })
	})

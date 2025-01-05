import { createServerFn } from "@tanstack/start"

import { deleteSessionTokenCookie, invalidateSession } from "@/server/auth/sessions"
import { authedMiddleware, csrfProtectionMiddleware } from "@/server/utils/middlewares"

export const $logout = createServerFn({ method: "POST" })
	.middleware([authedMiddleware, csrfProtectionMiddleware])
	.handler(async ({ context }) => {
		await invalidateSession({ sessionId: context.session.id })
		deleteSessionTokenCookie()
	})

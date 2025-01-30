import type { SuccessResponse } from "@/types/response"
import {
	deleteSessionTokenCookie,
	getCurrentSession,
	getCurrentUser,
	invalidateSession
} from "../../auth/sessions"
import { Hono } from "hono"
import { authedMiddleware } from "@/middlewares/authed-middleware"

export const userRouter = new Hono()
	.get("/", async (c) => {
		const user = await getCurrentUser()

		return c.json<SuccessResponse<typeof user | null>>({
			success: true,
			data: user
		})
	})
	.get("/session", async (c) => {
		const session = await getCurrentSession()

		return c.json<SuccessResponse<typeof session | null>>({
			success: true,
			data: session
		})
	})
	.post("/logout", authedMiddleware, async (c) => {
		const session = c.var.session

		await invalidateSession({ sessionId: session.id })
		deleteSessionTokenCookie()

		return c.json<SuccessResponse>({ success: true })
	})

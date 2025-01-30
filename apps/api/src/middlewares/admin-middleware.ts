import {
	getCurrentSession,
	getCurrentUser,
	type Session,
	type User
} from "@/auth/sessions"
import type { ErrorResponse } from "@/types/response"
import { createMiddleware } from "hono/factory"

export const adminMiddleware = createMiddleware<{
	Variables: {
		user: User
		session: Session
	}
}>(async (c, next) => {
	const [user, session] = await Promise.all([getCurrentUser(), getCurrentSession()])

	if (!user?.id || !session?.id) {
		return c.json<ErrorResponse>(
			{ success: false, error: "Usuário não autenticado" },
			401
		)
	}

	if (user.role !== "admin") {
		return c.json<ErrorResponse>({ success: false, error: "Usuário não autorizado" }, 401)
	}

	c.set("user", user)
	c.set("session", session)

	return next()
})

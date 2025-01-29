import { Hono } from "hono"
import { cors } from "hono/cors"
import { googleOauthRouter } from "./routes/oauth/google"
import { githubOauthRouter } from "./routes/oauth/github"
import { env } from "./environment/env"
import { userRouter } from "./routes/user"
import { authRouter } from "./routes/auth"
import { tagRouter } from "./routes/tag"
import { profileRouter } from "./routes/profile"
import { categoryRouter } from "./routes/category"
import { challengeRouter } from "./routes/challenge"
import { createRouteHandler } from "uploadthing/server"
import { uploadRouter } from "./upload"
import type { Context } from "./types/response"
import { contextStorage } from "hono/context-storage"
import { getCookie } from "hono/cookie"
import { rankRouter } from "./routes/rank"

const handlers = createRouteHandler({
	router: uploadRouter
})

const app = new Hono<Context>()

app.use(contextStorage())

app.use((c, next) => {
	const sessionToken = getCookie(c, "session")
	c.set("sessionToken", sessionToken)
	return next()
})

app.use(
	"*",
	cors({
		credentials: true,
		origin: env.FRONTEND_URL
	})
)

app.all("/api/uploadthing", (c) => handlers(c.req.raw))

const routes = app
	.basePath("/api")
	.route("/tag", tagRouter)
	.route("/rank", rankRouter)
	.route("/auth", authRouter)
	.route("/user", userRouter)
	.route("/profile", profileRouter)
	.route("/category", categoryRouter)
	.route("/challenge", challengeRouter)
	.route("/login/github", githubOauthRouter)
	.route("/login/google", googleOauthRouter)

export default app

export type ApiRoutes = typeof routes
export type UploadRouter = typeof uploadRouter

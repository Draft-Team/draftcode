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
import { uploadRouter } from "./routes/upload"
import type { Context } from "./types/response"
import { contextStorage } from "hono/context-storage"
import { getCookie } from "hono/cookie"
import { rankRouter } from "./routes/rank"
import { v2 as cloudinary } from "cloudinary"

const app = new Hono<Context>()

app.use(contextStorage())

app.use((_c, next) => {
	cloudinary.config({
		api_key: env.CLOUDINARY_API_KEY,
		api_secret: env.CLOUDINARY_API_SECRET,
		cloud_name: env.CLOUDINARY_CLOUD_NAME
	})
	return next()
})

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

const routes = app
	.basePath("/api")
	.route("/tag", tagRouter)
	.route("/rank", rankRouter)
	.route("/auth", authRouter)
	.route("/user", userRouter)
	.route("/upload", uploadRouter)
	.route("/profile", profileRouter)
	.route("/category", categoryRouter)
	.route("/challenge", challengeRouter)
	.route("/login/github", githubOauthRouter)
	.route("/login/google", googleOauthRouter)

export default app

export type ApiRoutes = typeof routes
export type UploadRouter = typeof uploadRouter

import { createAPIFileRoute } from "@tanstack/start/api"
import { createRouteHandler } from "uploadthing/server"

import { uploadRouter } from "@/server/upload/uploadthing"

const handlers = createRouteHandler({ router: uploadRouter })

export const APIRoute = createAPIFileRoute("/api/uploadthing")({
	GET: handlers,
	POST: handlers
})

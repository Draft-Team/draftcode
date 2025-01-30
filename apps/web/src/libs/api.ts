import { hc } from "hono/client"
import type { ApiRoutes } from "@draftcode/types"
import { env } from "@/environment/env"

export const api = hc<ApiRoutes>(env.VITE_BACKEND_URL, {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => {
		return fetch(input, {
			...init,
			credentials: "include"
		})
	}
}).api

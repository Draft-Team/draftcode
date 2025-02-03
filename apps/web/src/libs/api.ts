import { hc } from "hono/client"
import type { ApiRoutes } from "@draftcode/types"
import { env } from "@/environment/env"

interface ErrorResponse {
	error: string
	success: false
}

class ApiError extends Error {
	constructor(
		message: string,
		public status: number,
		public data?: ErrorResponse
	) {
		super(message)
		this.name = "ApiError"
	}
}

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
	const response = await fetch(input, {
		...init,
		credentials: "include"
	})

	if (!response.ok) {
		const data = (await response.json()) as ErrorResponse
		throw new ApiError(
			data.error || "Ocorreu um erro na requisição",
			response.status,
			data
		)
	}

	return response
}

export const api = hc<ApiRoutes>(env.VITE_BACKEND_URL, {
	fetch: customFetch
}).api

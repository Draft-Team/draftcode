import type { Env } from "hono"

export type SuccessResponse<T = void> = {
	success: true
	message?: string
	// biome-ignore lint/complexity/noBannedTypes: biome é zap
} & (T extends void ? {} : { data: T })

export interface ErrorResponse {
	success: false
	error: string
}

export interface Context extends Env {
	Variables: {
		sessionToken: string | undefined
	}
}

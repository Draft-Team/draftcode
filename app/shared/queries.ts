import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/start"

import { getCurrentSession, getCurrentUser } from "@/server/auth/sessions"

const authQueryKeys = {
	currentUser: ["currentUser"] as const,
	currentSession: ["currentSession"] as const
}

const $getCurrentUser = createServerFn().handler(async () => {
	return await getCurrentUser()
})

const $getCurrentSession = createServerFn().handler(async () => {
	return await getCurrentSession()
})

export const currentUserQueryOptions = queryOptions({
	queryKey: authQueryKeys.currentUser,
	queryFn: async () => {
		const user = await $getCurrentUser()
		return user ?? null
	}
})

export const currentSessionQueryOptions = queryOptions({
	queryKey: authQueryKeys.currentSession,
	queryFn: async () => {
		const session = await $getCurrentSession()
		return session ?? null
	}
})

import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/start"

import { getCurrentUserProfile } from "@/server/auth/sessions"

export const profileQueryKeys = {
	userProfile: ["userProfile"] as const
}

const $getCurrentUserProfile = createServerFn().handler(async () => {
	return await getCurrentUserProfile()
})

export const currentUserProfileQueryOptions = queryOptions({
	queryKey: profileQueryKeys.userProfile,
	queryFn: async () => {
		const profile = await $getCurrentUserProfile()
		return profile ?? null
	}
})

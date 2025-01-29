import { api } from "@/libs/api"
import { queryOptions } from "@tanstack/react-query"

const profileQueryKeys = {
	userProfile: ["userProfile"] as const
}

export const currentUserProfileQueryOptions = queryOptions({
	queryKey: profileQueryKeys.userProfile,
	queryFn: async () => {
		const profile = await api.profile.$get().then((res) => res.json())
		return profile.data
	}
})

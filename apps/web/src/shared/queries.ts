import { api } from "@/libs/api"
import { queryOptions } from "@tanstack/react-query"

export const userQueryKeys = {
	currentUser: ["currentUser"] as const,
	currentSession: ["currentSession"] as const
}

const challengesQueryKeys = {
	challenges: ["challenges"] as const
}

export const userProfileQueryKeys = {
	userProfile: ["userProfile"] as const
}

export const currentUserProfileQueryOptions = queryOptions({
	queryKey: userProfileQueryKeys.userProfile,
	queryFn: async () => {
		const profile = await api.profile.$get().then((res) => res.json())
		return profile.data
	}
})

export const challengesQueryOptions = queryOptions({
	queryKey: challengesQueryKeys.challenges,
	queryFn: async () => {
		const challenges = await api.challenge.$get().then((res) => res.json())
		return challenges.data
	}
})

export const currentUserQueryOptions = queryOptions({
	queryKey: userQueryKeys.currentUser,
	queryFn: async () => {
		const user = await api.user.$get().then((res) => res.json())
		return user.data
	}
})

export const currentSessionQueryOptions = queryOptions({
	queryKey: userQueryKeys.currentSession,
	queryFn: async () => {
		const session = await api.user.session.$get().then((res) => res.json())
		return session.data
	}
})

import { useSuspenseQuery } from "@tanstack/react-query"

import { currentUserProfileQueryOptions } from "../queries"

export const useProfile = () => {
	const profile = useSuspenseQuery(currentUserProfileQueryOptions)

	return { profile: profile.data }
}

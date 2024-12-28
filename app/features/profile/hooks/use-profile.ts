import { useSuspenseQueries } from "@tanstack/react-query"

import { currentUserProfileQueryOptions } from "../queries"

export const useProfile = () => {
	const [profile] = useSuspenseQueries({
		queries: [currentUserProfileQueryOptions]
	})

	return { profile: profile.data }
}

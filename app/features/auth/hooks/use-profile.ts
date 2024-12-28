import { useSuspenseQueries } from "@tanstack/react-query"

import { userProfileQueryOptions } from "../queries"

export const useProfile = () => {
	const [profile] = useSuspenseQueries({
		queries: [userProfileQueryOptions]
	})

	return { profile: profile.data }
}

import { useSuspenseQueries } from "@tanstack/react-query"

import {
	currentSessionQueryOptions,
	currentUserQueryOptions,
	userProfileQueryOptions
} from "../queries"

export const useAuth = () => {
	const [user, session, profile] = useSuspenseQueries({
		queries: [
			currentUserQueryOptions,
			currentSessionQueryOptions,
			userProfileQueryOptions
		]
	})

	return { user: user.data, session: session.data, profile: profile.data }
}

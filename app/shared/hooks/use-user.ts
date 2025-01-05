import { useSuspenseQueries } from "@tanstack/react-query"

import { currentSessionQueryOptions, currentUserQueryOptions } from "../queries"

export const useUser = () => {
	const [user, session] = useSuspenseQueries({
		queries: [currentUserQueryOptions, currentSessionQueryOptions]
	})

	return { user: user.data, session: session.data }
}

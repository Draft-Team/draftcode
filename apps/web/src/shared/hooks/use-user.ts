import { useSuspenseQueries } from "@tanstack/react-query"

import {
	currentSessionQueryOptions,
	currentUserQueryOptions,
	userBookmarksQueryOptions
} from "../queries"

export const useUser = () => {
	const [user, session, bookmarks] = useSuspenseQueries({
		queries: [
			currentUserQueryOptions,
			currentSessionQueryOptions,
			userBookmarksQueryOptions
		]
	})

	return { user: user.data, session: session.data, bookmarks: bookmarks.data }
}

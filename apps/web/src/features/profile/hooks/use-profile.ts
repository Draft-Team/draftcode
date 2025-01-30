import { useSuspenseQuery } from "@tanstack/react-query"

import { currentUserProfileQueryOptions } from "../queries"

export const useProfile = () => {
	const { data: profile } = useSuspenseQuery(currentUserProfileQueryOptions)

	const cover = profile?.images?.find((image) => image.type === "profile-cover")
	const avatar = profile?.images?.find((image) => image.type === "profile-avatar")

	return {
		profile: {
			...profile,
			images: {
				avatar,
				cover
			}
		}
	}
}

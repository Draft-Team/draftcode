import { currentUserProfileQueryOptions } from "../queries"
import { useSuspenseQuery } from "@tanstack/react-query"

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

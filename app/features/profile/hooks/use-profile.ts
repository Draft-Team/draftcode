import { useSuspenseQuery } from "@tanstack/react-query"

import { currentUserProfileQueryOptions } from "../queries"

export const useProfile = () => {
	const profile = useSuspenseQuery(currentUserProfileQueryOptions)

	const cover = profile.data?.images?.find((image) => image.type === "profile-cover")
	const avatar = profile.data?.images?.find((image) => image.type === "profile-avatar")

	const links = profile.data?.links?.reduce<Record<string, string>>((acc, item) => {
		acc[item.type] = item.url
		return acc
	}, {})

	return {
		profile: {
			...profile.data,
			images: {
				avatar,
				cover
			},
			links
		}
	}
}

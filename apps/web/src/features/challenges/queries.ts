import { api } from "@/libs/api"
import { queryOptions } from "@tanstack/react-query"

const challengeQueryKeys = {
	tags: ["tags"] as const,
	categories: ["categories"] as const
}

export const tagsQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.tags,
	queryFn: async () => {
		const tags = await api.tag.$get().then((res) => res.json())
		return tags.data
	}
})

export const categoriesQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.categories,
	queryFn: async () => {
		const categories = await api.category.$get().then((res) => res.json())
		return categories.data
	}
})

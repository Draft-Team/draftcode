import { api } from "@/libs/api"
import { queryOptions } from "@tanstack/react-query"

const rankingQueryKeys = {
	rankings: ["rankings"] as const
}

export const rankingQueryOption = queryOptions({
	queryKey: rankingQueryKeys.rankings,
	queryFn: async () => {
		const rankings = await api.rank.$get().then((res) => res.json())
		return rankings.data
	}
})

import { queryOptions } from "@tanstack/react-query"

import { $getPointsRanking } from "./services/get-points-ranking"

const rankingQueryKeys = {
	rankings: ["rankings"] as const
}

export const rankingQueryOption = queryOptions({
	queryKey: rankingQueryKeys.rankings,
	queryFn: async () => await $getPointsRanking()
})

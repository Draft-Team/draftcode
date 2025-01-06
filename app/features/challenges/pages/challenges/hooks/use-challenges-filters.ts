import { parseAsString, useQueryStates } from "nuqs"

export const useChallengesFilters = () => {
	return useQueryStates({
		search: parseAsString.withDefault(""),
		difficulty: parseAsString.withDefault("all"),
		score: parseAsString.withDefault("highest-score")
	})
}

import type { DBTypes } from "@/server/db/db-types"

type Challenge = DBTypes["challengesTable"]
type Difficulty = DBTypes["challengesTable"]["difficulty"]

const generateDifficulty = (index: number): Difficulty => {
	if (index % 4 === 0) return "easy"
	if (index % 4 === 1) return "medium"
	if (index % 4 === 2) return "hard"
	return "expert"
}

export const createChallengeMock = (quantity: number): Challenge[] => {
	return Array.from({ length: quantity }, (_, index) => ({
		id: index.toString(),
		status: "published",
		title: `Challenge ${index + 1}`,
		blocks: [{ type: "text", content: { text: "Text" } }],
		experienceForCompletion: (index + 1) * 100,
		difficulty: generateDifficulty(index),
		description: `Description for challenge ${index}`,
		createdAt: new Date(),
		updatedAt: new Date()
	}))
}

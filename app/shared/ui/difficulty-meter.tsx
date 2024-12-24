import { cn } from "@/libs/utils"

type Difficulty = "easy" | "medium" | "hard" | "expert"

const difficultyMap: Record<Difficulty, string> = {
	easy: "Fácil",
	medium: "Médio",
	hard: "Difícil",
	expert: "Expert"
}

const difficultyBarMap: Record<Difficulty, number> = {
	easy: 1,
	medium: 2,
	hard: 3,
	expert: 4
}

const DifficultyMeter = (props: { difficulty: Difficulty }) => {
	const difficulty = difficultyMap[props.difficulty]
	const difficultyQty = Object.keys(difficultyMap).length
	const difficultyBarQty = difficultyBarMap[props.difficulty]

	return (
		<div className="space-y-1">
			<p className="text-end text-sm text-muted-foreground">{difficulty}</p>
			<div className="flex gap-1">
				{Array.from({ length: difficultyQty }).map((_, index) => (
					<div
						key={index}
						className={cn(
							"h-1 w-4",
							index === 0 && "rounded-l",
							index === difficultyQty - 1 && "rounded-r",
							index < difficultyBarQty ? "bg-purple-600" : "bg-gray-300"
						)}
					/>
				))}
			</div>
		</div>
	)
}

export { DifficultyMeter }

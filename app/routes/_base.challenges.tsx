import React from "react"
import { createFileRoute } from "@tanstack/react-router"

import { Bookmark, Eye } from "lucide-react"
import { parseAsString, useQueryState } from "nuqs"

import { Button } from "@/shared/ui/button"
import {
	ChallengeCard,
	ChallengeCardContent,
	ChallengeCardDescription,
	ChallengeCardFooter,
	ChallengeCardImage,
	ChallengeCardTag,
	ChallengeCardTitle
} from "@/shared/ui/challenge-card"
import { DifficultyMeter, type Difficulty } from "@/shared/ui/difficulty-meter"
import { HeroSection } from "@/shared/ui/hero-section"
import { Input } from "@/shared/ui/input"
import { PointsBadge } from "@/shared/ui/points-badge"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui/select"

export const Route = createFileRoute("/_base/challenges")({
	component: RouteComponent
})

const mockChallenges: {
	id: number
	title: string
	description: string
	difficulty: Difficulty
	tags: string[]
	points: number
}[] = [
	{
		id: 1,
		title: "Desafio 1",
		difficulty: "easy",
		points: 100,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 2,
		title: "Desafio 2",
		difficulty: "medium",
		points: 200,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 3,
		title: "Desafio 3",
		difficulty: "hard",
		points: 300,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 4,
		title: "Desafio 4",
		difficulty: "expert",
		points: 400,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 5,
		title: "Desafio 5",
		difficulty: "easy",
		points: 500,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 6,
		title: "Desafio 6",
		difficulty: "medium",
		points: 600,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 7,
		title: "Desafio 7",
		difficulty: "hard",
		points: 700,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 8,
		title: "Desafio 8",
		difficulty: "expert",
		points: 800,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 9,
		title: "Desafio 9",
		difficulty: "easy",
		points: 900,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 10,
		title: "Desafio 10",
		difficulty: "medium",
		points: 1000,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 11,
		title: "Desafio 11",
		difficulty: "hard",
		points: 1100,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	}
]

function RouteComponent() {
	const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
	const [score, setScore] = useQueryState(
		"score",
		parseAsString.withDefault("highest-score")
	)
	const [difficulty, setDifficulty] = useQueryState(
		"difficulty",
		parseAsString.withDefault("all")
	)

	const filteredChallenges = React.useMemo(() => {
		const filteredChallenges = mockChallenges.filter((challenge) => {
			if (difficulty !== "all" && challenge.difficulty !== difficulty) {
				return false
			}

			if (search && !challenge.title.toLowerCase().includes(search.toLowerCase())) {
				return false
			}

			return true
		})

		// Ordenando os desafios com base no score
		if (score === "highest-score") {
			return filteredChallenges.sort((a, b) => b.points - a.points) // Ordenar por maior pontuação
		}

		if (score === "lowest-score") {
			return filteredChallenges.sort((a, b) => a.points - b.points) // Ordenar por menor pontuação
		}

		return filteredChallenges // Sem ordenação adicional
	}, [search, difficulty, score])

	return (
		<main className="space-y-7">
			<HeroSection>
				<div className="container">
					<h2 className="text-4xl font-bold">Desafios</h2>
					<p className="text-muted-foreground">
						Explore materiais e ferramentas criados para facilitar sua experiência no
						desafio.
					</p>
				</div>
			</HeroSection>

			<section className="container">
				<div className="flex flex-wrap items-center gap-4">
					<Input
						className="w-full md:max-w-64"
						placeholder="Buscar desafio"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<Select
						onValueChange={(value) => setDifficulty(value)}
						defaultValue={difficulty}>
						<SelectTrigger className="w-full sm:flex-1 md:min-w-[200px] md:flex-grow-0">
							<SelectValue placeholder="Dificuldade" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="easy">Fácil</SelectItem>
							<SelectItem value="medium">Médio</SelectItem>
							<SelectItem value="hard">Difícil</SelectItem>
							<SelectItem value="expert">Expert</SelectItem>
							<SelectItem value="all">Todos</SelectItem>
						</SelectContent>
					</Select>

					<Select onValueChange={(value) => setScore(value)} defaultValue={score}>
						<SelectTrigger className="w-full sm:flex-1 md:min-w-[200px] md:flex-grow-0">
							<SelectValue placeholder="Ordenar por" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="highest-score">Maior pontuação</SelectItem>
							<SelectItem value="lowest-score">Menor pontuação</SelectItem>
						</SelectContent>
					</Select>

					<Button
						className="w-full sm:w-auto"
						onClick={() => {
							void setScore("")
							void setSearch("")
							void setDifficulty("all")
						}}>
						Limpar filtros
					</Button>
				</div>
			</section>

			<section className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filteredChallenges.map((challenge) => (
					<ChallengeCard key={challenge.id}>
						<div className="relative">
							<ChallengeCardImage src="https://avatars.githubusercontent.com/u/94739199?v=4" />
							<PointsBadge points={challenge.points} className="absolute right-1 top-1" />
						</div>
						<ChallengeCardContent>
							<div className="flex items-center justify-between">
								<ChallengeCardTitle>{challenge.title}</ChallengeCardTitle>
								<DifficultyMeter difficulty={challenge.difficulty} />
							</div>
							<ChallengeCardDescription>{challenge.description}</ChallengeCardDescription>

							<div className="flex flex-wrap gap-3">
								{challenge.tags.map((tag) => (
									<ChallengeCardTag key={tag}>{tag}</ChallengeCardTag>
								))}
							</div>
						</ChallengeCardContent>
						<ChallengeCardFooter className="flex items-center justify-between">
							<Bookmark />
							<div className="flex gap-1">
								<Eye /> <span className="font-light">382</span>
							</div>
						</ChallengeCardFooter>
					</ChallengeCard>
				))}
			</section>
		</main>
	)
}

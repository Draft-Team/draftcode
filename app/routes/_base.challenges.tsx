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
import {
	difficultyBarMap,
	DifficultyMeter,
	type Difficulty
} from "@/shared/ui/difficulty-meter"
import { HeroSection } from "@/shared/ui/hero-section"
import { Input } from "@/shared/ui/input"
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
}[] = [
	{
		id: 1,
		title: "Desafio 1",
		difficulty: "easy",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 2,
		title: "Desafio 2",
		difficulty: "medium",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 3,
		title: "Desafio 3",
		difficulty: "hard",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 4,
		title: "Desafio 4",
		difficulty: "expert",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 5,
		title: "Desafio 5",
		difficulty: "easy",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 6,
		title: "Desafio 6",
		difficulty: "medium",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 7,
		title: "Desafio 7",
		difficulty: "hard",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 8,
		title: "Desafio 8",
		difficulty: "expert",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 9,
		title: "Desafio 9",
		difficulty: "easy",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 10,
		title: "Desafio 10",
		difficulty: "medium",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	},
	{
		id: 11,
		title: "Desafio 11",
		difficulty: "hard",
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
		tags: ["HTML", "CSS", "Javascript"]
	}
]

function RouteComponent() {
	const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
	const [orderBy, setOrderBy] = useQueryState(
		"orderBy",
		parseAsString.withDefault("newest-to-oldest")
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

		return filteredChallenges
	}, [search, difficulty])

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
						<SelectTrigger className="w-full sm:flex-1 md:min-w-[150px] md:flex-grow-0">
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

					<Select onValueChange={(value) => setOrderBy(value)} defaultValue={orderBy}>
						<SelectTrigger className="w-full sm:flex-1 md:min-w-[260px] md:flex-grow-0">
							<SelectValue placeholder="Ordenar por" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="oldest-to-newest">Mais velho para mais novo</SelectItem>
							<SelectItem value="newest-to-oldest">Mais novo para mais velho</SelectItem>
							<SelectItem value="easiest-to-hardest">
								Mais fácil para mais difícil
							</SelectItem>
							<SelectItem value="hardest-to-easiest">
								Mais difícil para mais fácil
							</SelectItem>
						</SelectContent>
					</Select>

					<Button
						className="w-full sm:w-auto"
						onClick={() => {
							void setSearch("")
							void setOrderBy("newest-to-oldest")
							void setDifficulty("all")
						}}>
						Limpar filtros
					</Button>
				</div>
			</section>

			<section className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filteredChallenges.map((challenge) => (
					<ChallengeCard key={challenge.id}>
						<ChallengeCardImage src="https://avatars.githubusercontent.com/u/94739199?v=4" />
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

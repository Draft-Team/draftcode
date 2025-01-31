import React from "react"

import { useSuspenseQuery } from "@tanstack/react-query"
import { Bookmark, Eye } from "lucide-react"

import {
	ChallengeCard,
	ChallengeCardContent,
	ChallengeCardDescription,
	ChallengeCardFooter,
	ChallengeCardImage,
	ChallengeCardTag,
	ChallengeCardTitle
} from "@/shared/components/challenge-card"
import { DifficultyMeter } from "@/shared/components/difficulty-meter"
import { HeroSection } from "@/shared/components/hero-section"
import { PointsBadge } from "@/shared/components/points-badge"

import { ChallengesFilters } from "../components/challenges-filters"
import { useChallengesFilters } from "../hooks/use-challenges-filters"
import { challengesQueryOptions } from "@/shared/queries"

export const ChallengesPage = () => {
	const { data: challenges } = useSuspenseQuery(challengesQueryOptions)
	const [{ score, search, difficulty }] = useChallengesFilters()

	const filteredChallenges = React.useMemo(() => {
		const filteredChallenges = challenges.filter((v) => {
			if (difficulty !== "all" && v.challenge.difficulty !== difficulty) {
				return false
			}

			if (search && !v.challenge.title.toLowerCase().includes(search.toLowerCase())) {
				return false
			}

			return true
		})

		if (score === "highest-score") {
			return filteredChallenges.sort((a, b) => {
				return b.challenge.experienceForCompletion - a.challenge.experienceForCompletion
			})
		}

		if (score === "lowest-score") {
			return filteredChallenges.sort((a, b) => {
				return a.challenge.experienceForCompletion - b.challenge.experienceForCompletion
			})
		}

		return filteredChallenges
	}, [search, difficulty, score, challenges])

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
				<ChallengesFilters />
			</section>

			<section className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filteredChallenges.map((v) => (
					<ChallengeCard key={v.challenge.id}>
						<div className="relative">
							<ChallengeCardImage
								src={
									v.coverImage ?? "https://avatars.githubusercontent.com/u/94739199?v=4"
								}
							/>
							<PointsBadge
								points={v.challenge.experienceForCompletion}
								className="absolute right-1 top-1"
							/>
						</div>
						<ChallengeCardContent>
							<div className="flex items-center justify-between">
								<ChallengeCardTitle>{v.challenge.title}</ChallengeCardTitle>
								<DifficultyMeter difficulty={v.challenge.difficulty} />
							</div>
							<ChallengeCardDescription>
								{v.challenge.description}
							</ChallengeCardDescription>

							<div className="flex flex-wrap gap-3">
								{v.tags.slice(0, 5).map((tag) => (
									<ChallengeCardTag key={tag.id}>{tag.name}</ChallengeCardTag>
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

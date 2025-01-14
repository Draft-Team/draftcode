import React from "react"

import { Bookmark, Eye } from "lucide-react"

import {
	ChallengeCard,
	ChallengeCardContent,
	ChallengeCardDescription,
	ChallengeCardFooter,
	ChallengeCardImage,
	ChallengeCardTag,
	ChallengeCardTitle
} from "@/shared/components/ui/challenge-card"
import { DifficultyMeter } from "@/shared/components/ui/difficulty-meter"
import { HeroSection } from "@/shared/components/ui/hero-section"
import { PointsBadge } from "@/shared/components/ui/points-badge"
import { createChallengeMock } from "@/shared/mocks/challenges"

import { ChallengesFilters } from "../components/challenges-filters"
import { useChallengesFilters } from "../hooks/use-challenges-filters"

export const ChallengesPage = () => {
	const [{ score, search, difficulty }] = useChallengesFilters()

	const filteredChallenges = React.useMemo(() => {
		const mockChallenges = createChallengeMock(10)

		const filteredChallenges = mockChallenges.filter((challenge) => {
			if (difficulty !== "all" && challenge.difficulty !== difficulty) {
				return false
			}

			if (search && !challenge.title.toLowerCase().includes(search.toLowerCase())) {
				return false
			}

			return true
		})

		if (score === "highest-score") {
			return filteredChallenges.sort(
				(a, b) => b.experienceForCompletion - a.experienceForCompletion
			)
		}

		if (score === "lowest-score") {
			return filteredChallenges.sort(
				(a, b) => a.experienceForCompletion - b.experienceForCompletion
			)
		}

		return filteredChallenges
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
				<ChallengesFilters />
			</section>

			<section className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{filteredChallenges.map((challenge) => (
					<ChallengeCard key={challenge.id}>
						<div className="relative">
							<ChallengeCardImage src="https://avatars.githubusercontent.com/u/94739199?v=4" />
							<PointsBadge
								points={challenge.experienceForCompletion}
								className="absolute right-1 top-1"
							/>
						</div>
						<ChallengeCardContent>
							<div className="flex items-center justify-between">
								<ChallengeCardTitle>{challenge.title}</ChallengeCardTitle>
								<DifficultyMeter difficulty={challenge.difficulty} />
							</div>
							<ChallengeCardDescription>{challenge.description}</ChallengeCardDescription>

							<div className="flex flex-wrap gap-3">
								<ChallengeCardTag>HTML</ChallengeCardTag>
								<ChallengeCardTag>CSS</ChallengeCardTag>
								<ChallengeCardTag>Javascript</ChallengeCardTag>
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

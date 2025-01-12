import { ArrowRight, Bookmark, Eye, StarsIcon } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
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
import { HeroSection, HeroSectionContent } from "@/shared/components/ui/hero-section"
import { PointsBadge } from "@/shared/components/ui/points-badge"
import { createChallengeMock } from "@/shared/mocks/challenges"

import { BenefitsCard } from "../components/benefits-card"
import { FeatureCard } from "../components/feature-card"
import { benefitsData } from "../constants/benefits-data"
import { featureData } from "../constants/feature-data"

const mockChallenges = createChallengeMock(3)

export const HomePage = () => {
	return (
		<main>
			<HeroSection className="border-none bg-background">
				<HeroSectionContent>
					<div className="mb-2 flex w-max animate-border items-center gap-1 rounded border border-transparent px-2 py-1 [background:linear-gradient(45deg,#000000,theme(colors.black)_50%,#000000)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.purple.600/.48)_80%,_theme(colors.purple.500)_86%,_theme(colors.purple.300)_90%,_theme(colors.purple.500)_94%,_theme(colors.purple.600/.48))_border-box] sm:mb-5">
						<StarsIcon size={18} />
						<span className="text-xs font-medium uppercase">Simples e prático</span>
					</div>
					<div className="flex max-w-[700px] flex-col gap-2">
						<h1 className="text-3xl font-bold sm:text-4xl">
							Eleve seu{" "}
							<span className="font-fira text-primary">
								{"{"}
								<span className="text-foreground">nível</span>
								{"}"}
							</span>{" "}
							com desafios que fazem a diferença
						</h1>
						<p className="text-muted-foreground">
							Coloque em prática suas habilidades e veja seu conhecimento crescer com
							projetos empolgantes.
						</p>
					</div>
					<div className="mb-2 mt-4 flex flex-col gap-4 uppercase sm:flex-row">
						<Button>Encare o Desafio</Button>
						<Button
							variant={"outline"}
							className="group"
							onClick={() => {
								document
									.getElementById("benefits")
									?.scrollIntoView({ behavior: "smooth" })
							}}>
							Saiba mais
							<ArrowRight className="transition-transform duration-300 group-hover:rotate-90" />
						</Button>
					</div>
					<span className="text-xs font-medium text-muted-foreground">
						Mais de 430 desafiantes
					</span>
				</HeroSectionContent>
			</HeroSection>

			<section className="container mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{featureData.map((data, index) => (
					<FeatureCard
						key={index}
						index={index}
						icon={data.icon}
						title={data.title}
						description={data.description}
					/>
				))}
			</section>

			<section className="container mt-11">
				<h1 className="mb-4 text-2xl font-bold">Desafios</h1>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{mockChallenges.map((challenge) => (
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
								<ChallengeCardDescription>
									{challenge.description}
								</ChallengeCardDescription>

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
				</div>
			</section>

			<section
				id="benefits"
				className="container mt-24 grid grid-cols-1 gap-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
				{benefitsData.map((data, index) => (
					<BenefitsCard
						index={index}
						description={data.description}
						title={data.title}
						icon={data.icon}
						key={index}
					/>
				))}
			</section>

			<section className="container mt-20 flex justify-center">
				<div className="flex flex-col items-center gap-4">
					<h2 className="text-center text-4xl font-bold">Comece a evoluir agora</h2>
					<Button>VER DESAFIOS</Button>
				</div>
			</section>
		</main>
	)
}

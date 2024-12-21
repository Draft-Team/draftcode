import { createFileRoute } from "@tanstack/react-router"

import { Bookmark, Ellipsis, Eye } from "lucide-react"

import {
	ChallengeCard,
	ChallengeCardContent,
	ChallengeCardDescription,
	ChallengeCardFooter,
	ChallengeCardHeader,
	ChallengeCardImage,
	ChallengeCardTitle
} from "@/shared/ui/challenge-card"
import { DifficultyMeter } from "@/shared/ui/difficulty-meter"

export const Route = createFileRoute("/zap")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<div className="flex h-screen items-center justify-center">
			<ChallengeCard className="w-full max-w-96">
				<ChallengeCardHeader className="flex justify-end">
					<Ellipsis />
				</ChallengeCardHeader>
				<ChallengeCardImage src="https://avatars.githubusercontent.com/u/94739199?v=4" />
				<ChallengeCardContent>
					<div className="flex items-center justify-between">
						<ChallengeCardTitle>Draftlab</ChallengeCardTitle>
						<DifficultyMeter difficulty="hard" />
					</div>

					<ChallengeCardDescription>
						Supere desafios, conecte talentos e brilhe na plataforma de inovação
						colaborativa. Desperte seu potencial.
					</ChallengeCardDescription>

					<div className="space-x-3">
						<button className="h-6 w-14 rounded bg-primary text-foreground">HTML</button>
						<button className="h-6 w-14 rounded bg-primary text-foreground">CSS</button>
						<button className="h-6 w-14 rounded bg-primary text-foreground">JS</button>
					</div>
				</ChallengeCardContent>
				<ChallengeCardFooter className="flex items-center justify-between">
					<Bookmark />
					<Eye />
				</ChallengeCardFooter>
			</ChallengeCard>
		</div>
	)
}

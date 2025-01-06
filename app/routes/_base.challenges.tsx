import { createFileRoute } from "@tanstack/react-router"

import { ChallengesPage } from "@/features/challenges/pages/challenges/challenges-page"

export const Route = createFileRoute("/_base/challenges")({
	component: ChallengesPage
})

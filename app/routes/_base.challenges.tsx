import { createFileRoute } from "@tanstack/react-router"

import { ChallengeListPage } from "@/features/challenges/pages/challenge-list/challenges-list-page"

export const Route = createFileRoute("/_base/challenges")({
	component: ChallengeListPage
})

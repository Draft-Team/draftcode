import { createFileRoute } from "@tanstack/react-router"

import { CreateChallengePage } from "@/features/challenges/pages/create-challenge-page"

export const Route = createFileRoute("/dashboard/_layout/")({
	component: CreateChallengePage
})

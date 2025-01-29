import { createFileRoute } from "@tanstack/react-router"

import { RankingsPage } from "@/features/ranks/pages/rankings-page"

export const Route = createFileRoute("/_base/ranks/")({
	component: RankingsPage
})

import { createFileRoute } from "@tanstack/react-router"

import { HomePage } from "@/features/landing/pages/home/home-page"

export const Route = createFileRoute("/_base/")({
	component: HomePage
})

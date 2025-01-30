import { HomePage } from "@/features/landing/pages/home-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_base/")({
	component: HomePage
})

import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/solutions")({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/solutions"!</div>
}

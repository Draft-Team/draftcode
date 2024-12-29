import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_base/profile/edit")({
	component: RouteComponent
})

function RouteComponent() {
	return <div>Hello "/_base/profile/edit"!</div>
}

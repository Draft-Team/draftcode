import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Footer } from "@/shared/components/footer"
import { Header } from "@/shared/components/header"

export const Route = createFileRoute("/_base")({
	component: RouteComponent
})

function RouteComponent() {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex-1">
				<Outlet />
			</div>
			<Footer />
		</div>
	)
}

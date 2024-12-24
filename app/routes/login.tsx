import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { ChevronLeft } from "lucide-react"

import { LoginCard } from "@/features/auth/components/login-card"
import { Button } from "@/shared/ui/button"

export const Route = createFileRoute("/login")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	},
	head: () => ({
		meta: [{ title: "Login" }]
	})
})

function RouteComponent() {
	return (
		<main className="container relative">
			<Button className="absolute m-10 ml-0" asChild variant="outline">
				<Link to="/">
					{" "}
					<ChevronLeft /> Voltar ao site
				</Link>
			</Button>

			<div className="container flex h-screen items-center justify-center">
				<LoginCard />
			</div>
		</main>
	)
}

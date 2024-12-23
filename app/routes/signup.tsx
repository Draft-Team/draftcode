import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { SignupCard } from "@/features/auth/components/signup-card"
import { Button } from "@/shared/ui/button"

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	},
	head: () => ({
		meta: [{ title: "Signup" }]
	})
})

function RouteComponent() {
	return (
		<main className="container relative">
			<Button className="absolute m-10 ml-0" asChild variant="outline">
				<Link to="/">Voltar ao site</Link>
			</Button>

			<div className="container flex h-screen items-center justify-center">
				<SignupCard />
			</div>
		</main>
	)
}

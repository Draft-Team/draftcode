import { createFileRoute, Link } from "@tanstack/react-router"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { Button } from "@/shared/ui/button"

export const Route = createFileRoute("/")({
	component: Home
})

function Home() {
	const { user } = useAuth()
	const { mutate } = useLogout()

	return (
		<main className="container mx-auto flex h-screen flex-col items-center justify-center gap-3">
			{user ? (
				<div>
					<h1>Welcome, {user.name}!</h1>
					<p>Your email is {user.email}.</p>
				</div>
			) : null}

			<div className="flex gap-3">
				<Button onClick={() => mutate()}>Logout</Button>
				<Button asChild>
					<Link to="/login">Login</Link>
				</Button>
			</div>
		</main>
	)
}

import { createFileRoute, redirect } from "@tanstack/react-router"

import { RegisterPage } from "@/features/auth/pages/register/register-page"

export const Route = createFileRoute("/register")({
	component: RegisterPage,
	beforeLoad: ({ context }) => {
		if (context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	},
	head: () => ({
		meta: [{ title: "Cadastro" }]
	})
})

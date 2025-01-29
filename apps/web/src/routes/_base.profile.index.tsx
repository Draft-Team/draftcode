import { createFileRoute, redirect } from "@tanstack/react-router"

import { ProfilePage } from "@/features/profile/pages/profile-page"

export const Route = createFileRoute("/_base/profile/")({
	component: ProfilePage,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	}
})

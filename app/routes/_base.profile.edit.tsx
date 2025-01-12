import { createFileRoute, redirect } from "@tanstack/react-router"

import { ProfileEditPage } from "@/features/profile/pages/profile-edit-page"

export const Route = createFileRoute("/_base/profile/edit")({
	component: ProfileEditPage,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	}
})

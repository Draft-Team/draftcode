import { createFileRoute, redirect } from "@tanstack/react-router"

import { useProfile } from "@/features/profile/hooks/use-profile"
import ProfileHeader from "@/pages/profile/components/profile-header"
import ProfileStatistics from "@/pages/profile/components/profile-statistics"

export const Route = createFileRoute("/_base/profile/")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	}
})

function RouteComponent() {
	const { profile } = useProfile()

	return (
		<>
			<ProfileHeader
				bio={profile?.bio ?? "Este usuário ainda não adicionou uma biografia."}
			/>
			<section className="container mt-4 grid grid-cols-[2fr_1fr] gap-4">
				<div>
					<ProfileStatistics totalExperience={profile?.totalExperience ?? 0} />
				</div>
				<div>zap2</div>
			</section>
		</>
	)
}

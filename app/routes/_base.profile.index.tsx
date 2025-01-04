import { createFileRoute, redirect } from "@tanstack/react-router"

import { useProfile } from "@/features/profile/hooks/use-profile"
import { ProfileActivityHistory } from "@/pages/profile/components/activity-history"
import { ProfileBadges } from "@/pages/profile/components/profile-badges"
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
				links={profile?.links}
				bio={profile?.bio ?? "Este usuário ainda não adicionou uma biografia."}
			/>
			<section className="grid- container mt-4 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
				<div className="order-2 md:order-first">
					<ProfileStatistics totalExperience={profile?.totalExperience ?? 0} />
					<ProfileActivityHistory />
				</div>
				<>
					<ProfileBadges />
				</>
			</section>
		</>
	)
}

import { ProfileActivityHistory } from "../components/activity-history"
import { ProfileBadges } from "../components/profile-badges"
import { ProfileHeader } from "../components/profile-header"
import { ProfileStatistics } from "../components/profile-statistics"

export const ProfilePage = () => {
	return (
		<>
			<ProfileHeader />
			<section className="grid- container mt-4 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
				<div className="order-2 md:order-first">
					<ProfileStatistics />
					<ProfileActivityHistory />
				</div>
				<>
					<ProfileBadges />
				</>
			</section>
		</>
	)
}

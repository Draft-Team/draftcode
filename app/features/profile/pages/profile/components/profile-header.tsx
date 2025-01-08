import { Link } from "@tanstack/react-router"

import {
	Camera,
	Edit2,
	Github,
	Globe,
	Grid,
	Linkedin,
	Twitch,
	Youtube,
	type LucideIcon
} from "lucide-react"

import { useProfile } from "@/features/profile/hooks/use-profile"
import { cn } from "@/libs/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import { useUser } from "@/shared/hooks/use-user"

export type SocialPlatform = "github" | "linkedin" | "twitch" | "youtube" | "website"
export const socialIcons: Record<SocialPlatform, LucideIcon> = {
	github: Github,
	linkedin: Linkedin,
	twitch: Twitch,
	youtube: Youtube,
	website: Globe
}

export const ProfileHeader = () => {
	const { user } = useUser()
	const { profile } = useProfile()

	const profileAvatarUrl = profile?.images?.find(
		(image) => image.type === "profile-avatar"
	)?.url
	const profileCoverUrl = profile?.images?.find(
		(image) => image.type === "profile-cover"
	)?.url

	return (
		<div className="overflow-hidden rounded-lg border-y bg-card shadow">
			<div className="relative h-48">
				{profileCoverUrl ? (
					<img
						src={profileCoverUrl}
						alt="User banner"
						className="h-full w-full object-cover object-center"
					/>
				) : (
					<div className="flex h-full w-full flex-wrap items-center justify-center bg-muted">
						<div className="grid grid-cols-banner gap-1">
							{[...Array(95).keys()].map((_, index: number) => {
								const activeIndices = [
									//D
									0, 19, 38, 57, 76, 1, 21, 40, 59, 77,
									//R
									80, 61, 42, 23, 4, 5, 6, 42, 25, 44, 62, 82, 43,
									//A
									84, 65, 46, 27, 9, 29, 47, 48, 67, 86,
									//F
									88, 69, 50, 31, 12, 13, 14, 51, 52,
									//T
									93, 74, 55, 36, 16, 17, 18
								]

								return (
									<div key={index} className="flex h-6 w-6 items-center justify-center">
										{activeIndices.includes(index) ? (
											<Grid className="h-6 w-6 text-primary" />
										) : (
											<span className="h-6 w-6"></span>
										)}
									</div>
								)
							})}
						</div>
					</div>
				)}

				<Link
					to="/profile/edit"
					className={cn(
						buttonVariants({ variant: "secondary" }),
						"absolute right-4 top-4"
					)}>
					<Edit2 className="mr-2 h-4 w-4" /> Editar Perfil
				</Link>
				<Button variant="secondary" size="icon" className="absolute bottom-4 right-4">
					<Camera className="h-4 w-4" />
				</Button>
			</div>
			<div className="container relative pb-6 pt-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="relative -mt-16 flex h-24 w-24 items-center justify-center rounded-full bg-card">
							<Avatar className="h-24 w-24 overflow-hidden rounded-full border-4 border-card">
								<AvatarImage
									src={profileAvatarUrl}
									alt={`foto de perfil do usuário ${user?.name}`}
								/>
								<AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
							</Avatar>
							<Button
								variant="secondary"
								size="icon"
								className="absolute bottom-0 right-0 rounded-full">
								<Camera className="h-4 w-4" />
							</Button>
						</div>
						<div>
							<h1 className="text-2xl font-bold">{user?.name}</h1>
							<p className="max-w-96 truncate text-sm text-muted-foreground">
								{profile?.bio ?? "Este usuário ainda não adicionou uma biografia."}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{profile
							? profile.links
									.filter(({ url }) => url)
									.map(({ type, url }) => {
										const Icon = socialIcons[type]
										return (
											<a
												key={url}
												href={url}
												target="_blank"
												rel="noopener noreferrer"
												className={cn(
													buttonVariants({ variant: "outline", size: "icon" })
												)}>
												<Icon />
											</a>
										)
									})
							: ""}
					</div>
				</div>
			</div>
		</div>
	)
}

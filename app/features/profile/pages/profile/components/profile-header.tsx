import { Link } from "@tanstack/react-router"

import { Edit2, Globe } from "lucide-react"

import { useProfile } from "@/features/profile/hooks/use-profile"
import { cn } from "@/libs/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { buttonVariants } from "@/shared/components/ui/button"
import { useUser } from "@/shared/hooks/use-user"
import { GithubLogo, LinkedinLogo, TwitchLogo, YoutubeLogo } from "@/shared/icons"

export const socialIcons = {
	github: GithubLogo,
	linkedin: LinkedinLogo,
	twitch: TwitchLogo,
	youtube: YoutubeLogo,
	website: Globe
}

export const ProfileHeader = () => {
	const { user } = useUser()
	const { profile } = useProfile()

	return (
		<div className="overflow-hidden rounded-lg border-y bg-card shadow">
			<div className="relative h-48">
				<img
					src={profile.images.cover?.url ?? "/hexagons.svg"}
					alt="User banner"
					className={cn("h-full w-full object-cover object-center", {
						"bg-[url('/hexagons.svg')]": !profile.images.cover?.url
					})}
				/>

				<Link
					to="/profile/edit"
					className={cn(
						buttonVariants({ variant: "secondary" }),
						"absolute right-4 top-4"
					)}>
					<Edit2 className="mr-2 h-4 w-4" /> Editar Perfil
				</Link>
			</div>
			<div className="container relative pb-6 pt-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="relative -mt-16 flex h-24 w-24 items-center justify-center rounded-full bg-card">
							<Avatar className="h-24 w-24 overflow-hidden rounded-full border-4 border-card">
								<AvatarImage
									src={profile.images.avatar?.url}
									alt={`foto de perfil do usuário ${user?.name}`}
								/>
								<AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
							</Avatar>
						</div>
						<div>
							<h1 className="text-2xl font-bold">{user?.name}</h1>
							<p className="max-w-96 truncate text-sm text-muted-foreground">
								{profile?.bio ?? "Este usuário ainda não adicionou uma biografia."}
							</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						{profile.links
							?.filter(({ url }) => url)
							.map(({ type, url }) => {
								const Icon = socialIcons[type]
								return (
									<a
										key={url}
										href={url}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
										<Icon />
									</a>
								)
							})}
					</div>
				</div>
			</div>
		</div>
	)
}

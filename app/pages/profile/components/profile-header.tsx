import { Link } from "@tanstack/react-router"

import { Camera, Edit2, LinkIcon } from "lucide-react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { cn } from "@/libs/utils"
import { Button, buttonVariants } from "@/shared/ui/button"

interface ProfileHeaderProps {
	bio: string
}

export default function ProfileHeader({ bio }: ProfileHeaderProps) {
	const { user } = useAuth()
	return (
		<div className="overflow-hidden rounded-lg border-y bg-card shadow">
			<div className="relative h-48">
				<img
					src="https://cdn.discordapp.com/attachments/417530820450844675/1323054703227174932/zap.png?ex=67731e36&is=6771ccb6&hm=8225da6e8ca943ae2af7ae72b559019b18ba055febe5ca91a4ac3d9051a372f3&"
					alt="User banner"
					className="h-full w-full object-cover"
				/>

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
							<img
								className="h-24 w-24 overflow-hidden rounded-full border-4 border-card"
								src="https://avatars.githubusercontent.com/u/68834970?v=4"
								alt="zap"
							/>
							<Button
								variant="secondary"
								size="icon"
								className="absolute bottom-0 right-0 rounded-full">
								<Camera className="h-4 w-4" />
							</Button>
						</div>
						<div>
							<h1 className="text-2xl font-bold">{user?.name}</h1>
							<p className="max-w-96 truncate text-sm text-muted-foreground">{bio}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Link to="/">
							<Button variant="outline" size={"icon"}>
								<LinkIcon />
							</Button>
						</Link>
						<Link to="/">
							<Button variant="outline" size={"icon"}>
								<LinkIcon />
							</Button>
						</Link>
						<Link to="/">
							<Button variant="outline" size={"icon"}>
								<LinkIcon />
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

import { Link } from "@tanstack/react-router"

import { ArrowLeft } from "lucide-react"

import { cn } from "@/libs/utils"
import { buttonVariants } from "@/shared/components/ui/button"

import { useProfile } from "../../hooks/use-profile"
import { ProfileForm } from "./components/profile-form"
import { useEditProfile } from "./hooks/use-edit-profile"
import type { ProfileData } from "./schemas/profile-schema"

export const ProfileEditPage = () => {
	const { profile } = useProfile()
	const { mutate: edit, isPending } = useEditProfile()

	const links = profile?.links.reduce<Record<string, string>>((acc, item) => {
		acc[item.type] = item.url
		return acc
	}, {})

	const defaultValues = {
		bio: profile?.bio ?? "",
		githubUrl: links?.github ?? "",
		linkedinUrl: links?.linkedin ?? "",
		twitchUrl: links?.twitch ?? "",
		youtubeUrl: links?.youtube ?? "",
		websiteUrl: links?.website ?? ""
	}

	const onSubmit = (data: ProfileData): void => {
		edit({ data })
	}

	return (
		<main className="container">
			<Link
				to="/profile"
				className={cn(buttonVariants({ variant: "outline" }), "font-medium")}>
				<ArrowLeft /> Voltar ao perfil
			</Link>

			<ProfileForm
				defaultValues={defaultValues}
				onSubmit={onSubmit}
				isPending={isPending}
			/>
		</main>
	)
}

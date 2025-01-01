import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import {
	ArrowLeft,
	Github,
	Globe,
	Linkedin,
	Plus,
	Twitch,
	X,
	Youtube,
	type LucideIcon
} from "lucide-react"
import { useForm } from "react-hook-form"

import { ProfileSchema, type ProfileData } from "@/features/auth/schemas/profile-schema"
import { useEditProfile } from "@/features/profile/hooks/use-edit-profile"
import { useProfile } from "@/features/profile/hooks/use-profile"
import { cn } from "@/libs/utils"
import { Button, buttonVariants } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"

export const Route = createFileRoute("/_base/profile/edit")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	}
})

export type SocialPlatform = "github" | "linkedin" | "twitch" | "youtube" | "website"
type SocialLink = ProfileData["socialLinks"][number]

const platformsList: SocialPlatform[] = [
	"github",
	"linkedin",
	"twitch",
	"youtube",
	"website"
]

export const socialIcons: Record<SocialPlatform, LucideIcon> = {
	github: Github,
	linkedin: Linkedin,
	twitch: Twitch,
	youtube: Youtube,
	website: Globe
}

function RouteComponent() {
	const { profile } = useProfile()

	const { mutate: edit, isPending } = useEditProfile()

	const getInitialLinks = () => {
		const initialLinks = platformsList.map((platform) => {
			const existingLink = profile?.link?.find((link) => link.type === platform)
			return {
				platform,
				url: existingLink?.url ?? "",
				active: !!existingLink
			}
		})
		return initialLinks
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue
	} = useForm<ProfileData>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			bio: profile?.bio ?? "",
			socialLinks: getInitialLinks()
		}
	})

	const socialLinks = watch("socialLinks")

	const toggleLinkActive = (index: number): void => {
		if (!socialLinks) return

		const newLinks: SocialLink[] = [...socialLinks].map((link, i) =>
			i === index ? { ...link, active: !link.active } : link
		)

		setValue("socialLinks", newLinks, { shouldValidate: true })
	}

	const onSubmit = (data: ProfileData): void => {
		console.log(data)
		edit({ data })
	}

	return (
		<main className="container">
			<Link
				to="/profile"
				className={cn(buttonVariants({ variant: "outline" }), "font-medium")}>
				<ArrowLeft /> Voltar ao perfil
			</Link>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-6 grid grid-cols-[2fr_1fr] gap-4">
				<div className="flex h-max flex-col gap-4 border bg-card p-4">
					<h1 className="text-2xl font-semibold">Editar Perfil</h1>
					<fieldset className="flex flex-col gap-4">
						<Label className="space-y-2" htmlFor="bio">
							<span>Bio</span>
							<Textarea {...register("bio")} />
							{errors.bio && <p className="mt-2 text-red-500">{errors.bio.message}</p>}
						</Label>
					</fieldset>

					<Button type="submit" mode="loading" isLoading={isPending}>
						Salvar
					</Button>
				</div>

				<div className="flex flex-col gap-4 border bg-card p-4">
					{socialLinks?.map((link, index) => {
						const Icon = socialIcons[link.platform]
						return (
							<div key={index} className="flex items-center space-x-2">
								<div className="relative flex-grow">
									<Icon
										className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
										size={20}
									/>
									<Input
										type="url"
										placeholder={`Seu perfil ${link.platform}`}
										{...register(`socialLinks.${index}.url`)}
										className="pl-10"
										disabled={!link.active}
									/>
									{errors.socialLinks?.[index]?.url && (
										<p className="mt-1 text-sm text-red-500">
											{errors.socialLinks[index]?.url?.message}
										</p>
									)}
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									onClick={() => toggleLinkActive(index)}
									className={cn(
										link.active
											? "text-red-500 hover:text-red-600"
											: "text-green-500 hover:text-green-600"
									)}>
									<span className="sr-only">{link.active ? "Desativar" : "Ativar"}</span>
									{link.active ? <X size={20} /> : <Plus size={20} />}
								</Button>
							</div>
						)
					})}
				</div>
			</form>
		</main>
	)
}

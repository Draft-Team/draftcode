import { useState } from "react"
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

	const links = profile?.link.reduce<Record<string, string>>((acc, item) => {
		acc[item.type] = item.url
		return acc
	}, {})

	const initialActiveState = {
		githubUrl: !!links?.github,
		linkedinUrl: !!links?.linkedin,
		twitchUrl: !!links?.twitch,
		youtubeUrl: !!links?.youtube,
		websiteUrl: !!links?.website
	}

	const [activeFields, setActiveFields] = useState(initialActiveState)

	const {
		register,
		handleSubmit,
		setValue,
		clearErrors,
		formState: { errors }
	} = useForm<ProfileData>({
		resolver: zodResolver(ProfileSchema),
		defaultValues: {
			bio: profile?.bio ?? "",
			githubUrl: links?.github ?? "",
			linkedinUrl: links?.linkedin ?? "",
			twitchUrl: links?.twitch ?? "",
			youtubeUrl: links?.youtube ?? "",
			websiteUrl: links?.website ?? ""
		}
	})

	const toggleField = (field: keyof typeof initialActiveState) => {
		setActiveFields((prev) => {
			const isActive = !prev[field]
			if (!isActive) {
				setValue(field as keyof ProfileData, "")
				clearErrors(field as keyof ProfileData)
			}
			return { ...prev, [field]: isActive }
		})
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

			<form onSubmit={handleSubmit(onSubmit)} className="mt-4">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Editar Perfil</h1>
					<Button type="submit" mode="loading" className="mb-4" isLoading={isPending}>
						Salvar
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
					<div className="flex h-max flex-col gap-4 border bg-card p-4">
						<fieldset className="flex flex-col gap-4">
							<Label className="space-y-2" htmlFor="bio">
								<span>Bio</span>
								<Textarea {...register("bio")} />
								{errors.bio && <p className="mt-2 text-red-500">{errors.bio.message}</p>}
							</Label>
						</fieldset>
					</div>

					<div className="flex flex-col gap-4 border bg-card p-4">
						{Object.keys(initialActiveState).map((field) => (
							<fieldset className="flex flex-col gap-2" key={field}>
								<div className="flex items-center gap-2">
									<div className="relative flex-grow">
										{(() => {
											const platform = field
												.replace("Url", "")
												.toLowerCase() as SocialPlatform
											const Icon = socialIcons[platform]
											return (
												<Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
											)
										})()}
										<Input
											className="pl-10"
											{...register(field as keyof ProfileData)}
											disabled={!activeFields[field as keyof typeof initialActiveState]}
										/>
									</div>

									<Button
										type="button"
										variant="outline"
										size="icon"
										onClick={() => toggleField(field as keyof typeof initialActiveState)}
										className={cn(
											activeFields[field as keyof typeof initialActiveState]
												? "text-red-500 hover:text-red-600"
												: "text-green-500 hover:text-green-600"
										)}>
										<span className="sr-only">
											{activeFields[field as keyof typeof initialActiveState]
												? "Desativar"
												: "Ativar"}
										</span>
										{activeFields[field as keyof typeof initialActiveState] ? (
											<X size={20} />
										) : (
											<Plus size={20} />
										)}
									</Button>
								</div>

								{errors[field as keyof ProfileData] && (
									<p className="mt-2 text-red-500">
										{errors[field as keyof ProfileData]?.message}
									</p>
								)}
							</fieldset>
						))}
					</div>
				</div>
			</form>
		</main>
	)
}

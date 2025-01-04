import { createFileRoute, Link, redirect } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Globe } from "lucide-react"
import { useForm } from "react-hook-form"

import { useEditProfile } from "@/features/profile/hooks/use-edit-profile"
import { useProfile } from "@/features/profile/hooks/use-profile"
import {
	ProfileSchema,
	type ProfileData
} from "@/features/profile/schemas/profile-schema"
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

function RouteComponent() {
	const { profile } = useProfile()
	const { mutate: edit, isPending } = useEditProfile()

	const links = profile?.links.reduce<Record<string, string>>((acc, item) => {
		acc[item.type] = item.url
		return acc
	}, {})

	const {
		register,
		handleSubmit,
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

				<div className="grid grid-cols-1 gap-4">
					<div className="flex h-max flex-col gap-4 border bg-card p-4">
						<fieldset className="flex flex-col gap-4">
							<Label className="space-y-2" htmlFor="bio">
								<span>Bio</span>
								<Textarea {...register("bio")} />
								{errors.bio && <p className="mt-2 text-red-500">{errors.bio.message}</p>}
							</Label>
						</fieldset>

						<h1>Links</h1>
						<fieldset className="flex flex-col gap-4">
							<Label className="relative flex-grow" htmlFor="bio">
								<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="URL do github"
									className="pl-10"
									{...register("githubUrl")}
								/>
							</Label>
							{errors.githubUrl && (
								<p className="mt-2 text-red-500">{errors.githubUrl.message}</p>
							)}
						</fieldset>
						<fieldset className="flex flex-col gap-4">
							<Label className="relative flex-grow" htmlFor="bio">
								<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="URL do linkedin"
									className="pl-10"
									{...register("linkedinUrl")}
								/>
							</Label>
							{errors.linkedinUrl && (
								<p className="mt-2 text-red-500">{errors.linkedinUrl.message}</p>
							)}
						</fieldset>
						<fieldset className="flex flex-col gap-4">
							<Label className="relative flex-grow" htmlFor="bio">
								<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="URL da twitch"
									className="pl-10"
									{...register("twitchUrl")}
								/>
							</Label>
							{errors.twitchUrl && (
								<p className="mt-2 text-red-500">{errors.twitchUrl.message}</p>
							)}
						</fieldset>
						<fieldset className="flex flex-col gap-4">
							<Label className="relative flex-grow" htmlFor="bio">
								<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="URL do portfolio"
									className="pl-10"
									{...register("websiteUrl")}
								/>
							</Label>
							{errors.websiteUrl && (
								<p className="mt-2 text-red-500">{errors.websiteUrl.message}</p>
							)}
						</fieldset>
						<fieldset className="flex flex-col gap-4">
							<Label className="relative flex-grow" htmlFor="bio">
								<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="URL do youtube"
									className="pl-10"
									{...register("youtubeUrl")}
								/>
							</Label>
							{errors.youtubeUrl && (
								<p className="mt-2 text-red-500">{errors.youtubeUrl.message}</p>
							)}
						</fieldset>
					</div>
				</div>
			</form>
		</main>
	)
}

import { createFileRoute, Link } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft } from "lucide-react"
import { useForm } from "react-hook-form"

import { ProfileSchema, type ProfileData } from "@/features/auth/schemas/profile-schema"
import { useEditProfile } from "@/features/profile/hooks/use-edit-profile"
import { useProfile } from "@/features/profile/hooks/use-profile"
import { cn } from "@/libs/utils"
import { Button, buttonVariants } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"

export const Route = createFileRoute("/_base/profile/edit")({
	component: RouteComponent
})

function RouteComponent() {
	const { profile } = useProfile()

	const { mutate: edit, isPending } = useEditProfile()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ProfileData>({
		resolver: zodResolver(ProfileSchema)
	})

	const onSubmit = (data: ProfileData) => {
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
				className="mt-6 flex flex-col gap-4 border bg-card p-4">
				<h1 className="text-2xl font-semibold">Editar Perfil</h1>
				<fieldset className="flex flex-col gap-4">
					<Label className="space-y-2" htmlFor={register("bio").name}>
						<span>Bio</span>
						<Textarea {...register("bio")} defaultValue={profile?.bio ?? ""} />
						{errors.bio && <p className="mt-2 text-red-500">{errors.bio.message}</p>}
					</Label>
				</fieldset>

				<Button type="submit" mode="loading" isLoading={isPending}>
					Salvar
				</Button>
			</form>
		</main>
	)
}

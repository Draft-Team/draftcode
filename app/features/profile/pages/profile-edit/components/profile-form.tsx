import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"

import { ProfileSchema, type ProfileData } from "../schemas/profile-schema"
import { SocialLinkField } from "./social-links-field"

interface ProfileFormProps {
	defaultValues: ProfileData
	onSubmit: (data: ProfileData) => void
	isPending: boolean
}

export const ProfileForm = ({ defaultValues, onSubmit, isPending }: ProfileFormProps) => {
	const {
		watch,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ProfileData>({
		defaultValues,
		resolver: zodResolver(ProfileSchema)
	})

	const watchBanner = watch("banner")?.[0]

	const socialLinks = [
		{ placeholder: "URL do github", fieldName: "githubUrl" as const },
		{ placeholder: "URL do linkedin", fieldName: "linkedinUrl" as const },
		{ placeholder: "URL da twitch", fieldName: "twitchUrl" as const },
		{ placeholder: "URL do portfolio", fieldName: "websiteUrl" as const },
		{ placeholder: "URL do youtube", fieldName: "youtubeUrl" as const }
	]

	return (
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
						<Label className="space-y-2" htmlFor={register("banner").name}>
							<span>Banner</span>
							<input
								type="file"
								className="hidden"
								{...register("banner")}
								id={register("banner").name}
							/>
							<figure className="max-h-40 w-full overflow-hidden">
								{watchBanner ? (
									<img
										src={URL.createObjectURL(watchBanner)}
										alt="Banner"
										className="h-full w-full object-cover"
									/>
								) : (
									<img
										src="https://placehold.co/1100x160"
										alt="Banner"
										className="h-full w-full object-cover"
									/>
								)}
							</figure>
						</Label>
					</fieldset>

					<fieldset className="flex flex-col gap-4">
						<Label className="space-y-2" htmlFor="bio">
							<span>Bio</span>
							<Textarea className="h-24 resize-none" {...register("bio")} />
							{errors.bio && <p className="mt-2 text-red-500">{errors.bio.message}</p>}
						</Label>
					</fieldset>

					<h1>Links</h1>
					{socialLinks.map(({ placeholder, fieldName }) => (
						<SocialLinkField
							key={fieldName}
							placeholder={placeholder}
							fieldName={fieldName}
							register={register}
							errors={errors}
						/>
					))}
				</div>
			</div>
		</form>
	)
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useProfile } from "@/features/profile/hooks/use-profile"
import { Button } from "@/shared/components/ui/button"
import { Label } from "@/shared/components/ui/label"
import { Textarea } from "@/shared/components/ui/textarea"

import { useEditProfile } from "../hooks/use-edit-profile"
import { ProfileSchema, type ProfileData } from "../schemas/profile-schema"
import { SocialLinkField } from "./social-links-field"

export const ProfileForm = () => {
	const { profile } = useProfile()
	const { mutateAsync: edit, isPending } = useEditProfile()
	const profileCoverImage = profile?.images.find(
		(image) => image.type === "profile-cover"
	)
	const profileAvatarImage = profile?.images.find(
		(image) => image.type === "profile-avatar"
	)

	const links = profile?.links.reduce<Record<string, string>>((acc, item) => {
		acc[item.type] = item.url
		return acc
	}, {})

	const {
		watch,
		reset,
		register,
		handleSubmit,
		formState: { errors, isDirty }
	} = useForm<ProfileData>({
		defaultValues: {
			bio: profile?.bio ?? "",
			githubUrl: links?.github,
			linkedinUrl: links?.linkedin,
			twitchUrl: links?.twitch,
			youtubeUrl: links?.youtube,
			websiteUrl: links?.website
		},
		resolver: zodResolver(ProfileSchema)
	})

	const watchProfileCover = watch("profileCover")?.[0]
	const watchProfileAvatar = watch("profileAvatar")?.[0]

	const socialLinks = [
		{ placeholder: "URL do github", fieldName: "githubUrl" as const },
		{ placeholder: "URL do linkedin", fieldName: "linkedinUrl" as const },
		{ placeholder: "URL da twitch", fieldName: "twitchUrl" as const },
		{ placeholder: "URL do portfolio", fieldName: "websiteUrl" as const },
		{ placeholder: "URL do youtube", fieldName: "youtubeUrl" as const }
	]

	const onSubmit = async (data: ProfileData) => {
		await edit({ ...data })
		reset()
	}
	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mt-4">
			<div className="mb-4 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Editar Perfil</h1>
				<Button
					type="submit"
					mode="loading"
					disabled={!isDirty}
					className="mb-4"
					isLoading={isPending}>
					Salvar
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4">
				<div className="flex h-max flex-col gap-4 border bg-card p-4">
					<fieldset className="flex flex-col gap-4">
						<Label className="space-y-2" htmlFor={register("profileAvatar").name}>
							<span>Avatar</span>
							<input
								type="file"
								className="hidden"
								{...register("profileAvatar")}
								id={register("profileAvatar").name}
							/>
							<figure className="h-24 w-24 overflow-hidden rounded-full">
								{watchProfileAvatar ? (
									<img
										src={URL.createObjectURL(watchProfileAvatar)}
										alt="Profile Avatar"
										className="h-full w-full object-cover"
									/>
								) : (
									<img
										src={profileAvatarImage?.url ?? "https://placehold.co/96x96"}
										alt="Profile Avatar"
										className="h-full w-full object-cover"
									/>
								)}
							</figure>
						</Label>
					</fieldset>

					<fieldset className="flex flex-col gap-4">
						<Label className="space-y-2" htmlFor={register("profileCover").name}>
							<span>Cover do perfil</span>
							<input
								type="file"
								className="hidden"
								{...register("profileCover")}
								id={register("profileCover").name}
							/>
							<figure className="max-h-40 w-full overflow-hidden">
								{watchProfileCover ? (
									<img
										src={URL.createObjectURL(watchProfileCover)}
										alt="Profile Cover"
										className="h-full w-full object-cover"
									/>
								) : (
									<img
										src={profileCoverImage?.url ?? "https://placehold.co/1100x160"}
										alt="Profile Cover"
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

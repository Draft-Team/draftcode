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

	const {
		watch,
		reset,
		register,
		handleSubmit,
		formState: { errors, isDirty }
	} = useForm<ProfileData>({
		defaultValues: {
			bio: profile?.bio,
			githubUrl: profile.links?.github,
			linkedinUrl: profile.links?.linkedin,
			twitchUrl: profile.links?.twitch,
			youtubeUrl: profile.links?.youtube,
			websiteUrl: profile.links?.website
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
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="mt-4 flex flex-col gap-4 border bg-card p-4">
			<fieldset className="flex w-max flex-col gap-4">
				<Label className="space-y-2" htmlFor={register("profileAvatar").name}>
					<span>Avatar</span>
					<input
						type="file"
						className="hidden"
						{...register("profileAvatar")}
						id={register("profileAvatar").name}
					/>
					<figure className="h-24 w-24 cursor-pointer overflow-hidden rounded">
						{watchProfileAvatar ? (
							<img
								src={URL.createObjectURL(watchProfileAvatar)}
								alt="Profile Avatar"
								className="h-full w-full object-cover"
							/>
						) : (
							<img
								src={profile.images.avatar?.url ?? "https://placehold.co/96x96"}
								alt="Profile Avatar"
								className="h-full w-full object-cover"
							/>
						)}
					</figure>
				</Label>
			</fieldset>

			<fieldset className="flex flex-col gap-4">
				<Label className="space-y-2" htmlFor={register("profileCover").name}>
					<span>Capa do perfil</span>
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
								src={profile.images.cover?.url ?? "https://placehold.co/1100x160"}
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

			{socialLinks.map(({ placeholder, fieldName }) => (
				<SocialLinkField
					key={fieldName}
					placeholder={placeholder}
					fieldName={fieldName}
					register={register}
					errors={errors}
				/>
			))}

			<Button
				type="submit"
				mode="loading"
				disabled={!isDirty}
				className="mb-4"
				isLoading={isPending}>
				Salvar
			</Button>
		</form>
	)
}

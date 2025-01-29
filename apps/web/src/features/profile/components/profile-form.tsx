import { zodResolver } from "@hookform/resolvers/zod"
import { Globe } from "lucide-react"
import { useForm } from "react-hook-form"

import { useProfile } from "@/features/profile/hooks/use-profile"
import type { DBTypes } from "@draftcode/types"
import { Button } from "@draftcode/ui/components/button"
import { Input } from "@draftcode/ui/components/input"
import { Label } from "@draftcode/ui/components/label"
import { Textarea } from "@draftcode/ui/components/textarea"
import { useUser } from "@/shared/hooks/use-user"

import { useEditProfile } from "../hooks/use-edit-profile"
import { ProfileSchema, type ProfileData } from "../schemas/profile-schema"

type LinkType = DBTypes["profileLinksTable"]["type"]
type LinkField = `${LinkType}Url`

const socialLinkFields: LinkField[] = [
	"githubUrl",
	"linkedinUrl",
	"youtubeUrl",
	"twitchUrl",
	"websiteUrl"
]

export const ProfileForm = () => {
	const { user } = useUser()
	const { profile } = useProfile()
	const { mutateAsync: edit, isPending } = useEditProfile()

	const links = profile.links?.reduce<Record<LinkType, string>>(
		(acc, item) => {
			acc[item.type] = item.url
			return acc
		},
		{} as Record<LinkType, string>
	)

	const {
		watch,
		reset,
		register,
		handleSubmit,
		formState: { errors, isDirty }
	} = useForm<ProfileData>({
		resolver: zodResolver(ProfileSchema)
	})

	const watchProfileCover = watch("profileCover")?.[0]
	const watchProfileAvatar = watch("profileAvatar")?.[0]

	const onSubmit = async (data: ProfileData) => {
		await edit(data)
		reset()
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 border bg-card p-4"
		>
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
				<Label className="space-y-2" htmlFor={register("name").name}>
					<span>Nome</span>
					<Input {...register("name")} defaultValue={user?.name ?? ""} />
					{errors.name && <p className="mt-2 text-red-500">{errors.name.message}</p>}
				</Label>
			</fieldset>

			<fieldset className="flex flex-col gap-4">
				<Label className="space-y-2" htmlFor={register("bio").name}>
					<span>Bio</span>
					<Textarea
						className="h-24 resize-none"
						{...register("bio")}
						defaultValue={profile.bio ?? ""}
					/>
					{errors.bio && <p className="mt-2 text-red-500">{errors.bio.message}</p>}
				</Label>
			</fieldset>

			{socialLinkFields.map((fieldName) => (
				<fieldset className="flex flex-col gap-4" key={fieldName}>
					<Label className="relative flex-grow" htmlFor={register(fieldName).name}>
						<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="pl-10"
							{...register(fieldName)}
							defaultValue={links?.[`${fieldName.slice(0, -3)}` as LinkType]}
							placeholder={`URL do ${fieldName.charAt(0).toUpperCase() + fieldName.slice(1, -3)}`}
						/>
					</Label>
					{errors[fieldName] && (
						<p className="mt-2 text-red-500">{errors[fieldName]?.message}</p>
					)}
				</fieldset>
			))}

			<Button
				type="submit"
				mode="loading"
				disabled={!isDirty || isPending}
				className="mb-4"
				isLoading={isPending}
			>
				Salvar
			</Button>
		</form>
	)
}

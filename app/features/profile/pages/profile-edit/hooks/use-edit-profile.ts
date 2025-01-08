import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { genUploader } from "uploadthing/client"

import type { UploadRouter } from "@/server/upload/uploadthing"
import { validateImageDimensions } from "@/shared/services/validate-image"

import type { ProfileData } from "../schemas/profile-schema"
import { $editprofile } from "../services/edit-profile"

const { uploadFiles } = genUploader<UploadRouter>({
	package: "uploadthing"
})

export const useEditProfile = () => {
	const editProfile = useServerFn($editprofile)

	return useMutation({
		mutationFn: async (props: ProfileData) => {
			const { profileAvatar, profileCover } = props

			if (profileAvatar?.[0]) {
				await validateImageDimensions(profileAvatar[0], 96, 96)
				await uploadFiles("profileAvatar", {
					files: [profileAvatar[0]]
				})
			}

			if (profileCover?.[0]) {
				await validateImageDimensions(profileCover[0], 2560, 199)
				await uploadFiles("profileCover", {
					files: [profileCover[0]]
				})
			}

			await editProfile({ data: props })
		},
		onSuccess: () => {
			toast.success("Perfil atualizado com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao atualizar perfil.")
		}
	})
}

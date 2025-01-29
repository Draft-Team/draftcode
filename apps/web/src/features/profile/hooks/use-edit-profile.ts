import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { validateImageDimensions } from "@/libs/validate-image"

import type { ProfileData } from "../schemas/profile-schema"
import { uploadFiles } from "@/libs/upload"
import { api } from "@/libs/api"

export const useEditProfile = () => {
	return useMutation({
		mutationFn: async (props: ProfileData) => {
			const { profileAvatar, profileCover, ...rest } = props

			if (profileAvatar?.[0]) {
				await validateImageDimensions(profileAvatar[0], 96, 96)
				await uploadFiles("profileAvatar", {
					files: [profileAvatar[0]]
				})
			}

			if (profileCover?.[0]) {
				await validateImageDimensions(profileCover[0], 1100, 199)
				await uploadFiles("profileCover", {
					files: [profileCover[0]]
				})
			}

			return await api.profile.edit.$post({ json: rest })
		},
		onSuccess: () => {
			toast.success("Perfil atualizado com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao atualizar perfil.")
		}
	})
}

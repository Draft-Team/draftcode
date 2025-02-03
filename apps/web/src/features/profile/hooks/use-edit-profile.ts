import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import type { ProfileData } from "../schemas/profile-schema"
import { api } from "@/libs/api"
import { userProfileQueryKeys, userQueryKeys } from "@/shared/queries"

export const useEditProfile = () => {
	return useMutation({
		meta: {
			invalidates: [
				userQueryKeys.currentUser,
				userQueryKeys.currentSession,
				userProfileQueryKeys.userProfile
			]
		},
		mutationFn: async (props: ProfileData) => {
			const { profileAvatar, profileCover, ...rest } = props

			if (profileAvatar?.[0]) {
				await api.upload.profile.avatar.$post({
					form: {
						file: profileAvatar[0]
					}
				})
			}

			if (profileCover?.[0]) {
				await api.upload.profile.cover.$post({
					form: {
						file: profileCover[0]
					}
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

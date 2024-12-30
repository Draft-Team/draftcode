import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { profileQueryKeys } from "../queries"
import { $editprofile } from "../services/edit-profile"

export const useEditProfile = () => {
	const queryClient = useQueryClient()
	const editProfile = useServerFn($editprofile)

	return useMutation({
		mutationFn: editProfile,
		onSuccess: () => {
			toast.success("Perfil atualizado com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao atualizar perfil.")
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: profileQueryKeys.userProfile })
		}
	})
}

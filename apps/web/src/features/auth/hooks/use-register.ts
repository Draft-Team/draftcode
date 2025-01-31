import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/libs/api"
import { userProfileQueryKeys, userQueryKeys } from "@/shared/queries"

export const useRegister = () => {
	const router = useRouter()

	return useMutation({
		meta: {
			invalidates: [
				userQueryKeys.currentUser,
				userQueryKeys.currentSession,
				userProfileQueryKeys.userProfile
			]
		},
		mutationFn: async (data: { name: string; email: string; password: string }) => {
			await api.auth.register.$post({
				json: { email: data.email, password: data.password, name: data.name }
			})
		},
		onSuccess: () => {
			toast.success("Cadastro efetuado com sucesso!")

			void router.navigate({ to: "/" })
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})
}

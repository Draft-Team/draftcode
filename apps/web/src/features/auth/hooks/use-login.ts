import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/libs/api"
import { userProfileQueryKeys, userQueryKeys } from "@/shared/queries"

export const useLogin = () => {
	const router = useRouter()

	return useMutation({
		meta: {
			invalidates: [
				userQueryKeys.currentUser,
				userQueryKeys.currentSession,
				userProfileQueryKeys.userProfile
			]
		},
		mutationFn: async (data: { email: string; password: string }) => {
			await api.auth.login.$post({ json: { email: data.email, password: data.password } })
		},
		onSuccess: () => {
			toast.success("Login efetuado com sucesso!")

			void router.navigate({ to: "/" })
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})
}

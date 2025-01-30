import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/libs/api"

export const useLogin = () => {
	const router = useRouter()

	return useMutation({
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

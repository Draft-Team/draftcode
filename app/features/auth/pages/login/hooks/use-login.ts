import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { $login } from "../services/login"

export const useLogin = () => {
	const router = useRouter()
	const login = useServerFn($login)

	return useMutation({
		mutationFn: login,
		onSuccess: () => {
			toast.success("Login efetuado com sucesso!")

			void router.navigate({ to: "/" })
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})
}

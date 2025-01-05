import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { $register } from "../services/register"

export const useRegister = () => {
	const router = useRouter()
	const register = useServerFn($register)

	return useMutation({
		mutationFn: register,
		onSuccess: () => {
			toast.success("Cadastro efetuado com sucesso!")

			void router.navigate({ to: "/" })
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})
}

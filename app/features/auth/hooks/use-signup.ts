import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { $signup } from "../services/signup"

export const useSignup = () => {
	const router = useRouter()
	const signup = useServerFn($signup)

	return useMutation({
		mutationFn: signup,
		onSuccess: () => {
			toast.success("Cadastro efetuado com sucesso!")

			void router.navigate({ to: "/" })
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})
}

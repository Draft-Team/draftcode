import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { authQueryKeys } from "../queries"
import { $signup } from "../services/signup"

export const useSignup = () => {
	const queryClient = useQueryClient()
	const signup = useServerFn($signup)

	return useMutation({
		mutationFn: signup,
		onSuccess: () => {
			toast.success("Cadastro efetuado com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message)
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser })
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentSession })
		}
	})
}

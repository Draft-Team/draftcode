import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"

import { authQueryKeys } from "../queries"
import { $signup } from "../services/signup"

export const useSignup = () => {
	const queryClient = useQueryClient()
	const signup = useServerFn($signup)

	return useMutation({
		mutationFn: signup,
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser })
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentSession })
		}
	})
}

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"

import { authQueryKeys } from "../queries"
import { $login } from "../services/login"

export const useLogin = () => {
	const queryClient = useQueryClient()
	const login = useServerFn($login)

	return useMutation({
		mutationFn: login,
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser })
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentSession })
		}
	})
}

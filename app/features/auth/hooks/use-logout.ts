import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"

import { authQueryKeys } from "../queries"
import { $logout } from "../services/logout"

export const useLogout = () => {
	const queryClient = useQueryClient()
	const logout = useServerFn($logout)

	return useMutation({
		mutationFn: async () => await logout(),
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentUser })
			await queryClient.invalidateQueries({ queryKey: authQueryKeys.currentSession })
		}
	})
}

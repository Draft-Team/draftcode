import { useRouter } from "@tanstack/react-router"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { authQueryKeys } from "../queries"
import { $logout } from "../services/logout"

export const useLogout = () => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const logout = useServerFn($logout)

	return useMutation({
		mutationFn: async () => await logout(),
		onSuccess: () => {
			toast.success("Até mais!")

			void router.navigate({ to: "/" })
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

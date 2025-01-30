import { useRouter } from "@tanstack/react-router"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/libs/api"

export const useLogout = () => {
	const router = useRouter()

	return useMutation({
		mutationFn: async () => await api.user.logout.$post(),
		onSuccess: () => {
			toast.success("Até mais!")

			void router.navigate({ to: "/" })
		},
		onError: (error) => {
			toast.error(error.message)
		}
	})
}

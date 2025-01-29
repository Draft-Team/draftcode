import { api } from "@/libs/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateTag = () => {
	return useMutation({
		mutationFn: async (data: { name: string }) => {
			return await api.tag.$post({ json: { name: data.name } }).then((res) => res.json())
		},
		onSuccess: () => {
			toast.success("Tag criada com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar tag.")
		}
	})
}

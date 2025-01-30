import { api } from "@/libs/api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

export const useCreateCategory = () => {
	return useMutation({
		mutationFn: async (data: { name: string }) => {
			return api.category.$post({ json: { name: data.name } }).then((res) => res.json())
		},
		onSuccess: () => {
			toast.success("Categoria criada com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar categoria.")
		}
	})
}

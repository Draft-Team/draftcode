import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { $createCategory } from "../services/create-category"

export const useCreateCategory = () => {
	const createCategory = useServerFn($createCategory)

	return useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			toast.success("Categoria criada com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar categoria.")
		}
	})
}

import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"

import { $createTag } from "../services/create-tag"

export const useCreateTag = () => {
	const createTag = useServerFn($createTag)

	return useMutation({
		mutationFn: createTag,
		onSuccess: () => {
			toast.success("Tag criada com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar tag.")
		}
	})
}

import { useMutation } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/start"
import { toast } from "sonner"
import { genUploader } from "uploadthing/client"

import type { UploadRouter } from "@/server/upload/uploadthing"

import type { CreateChallengeData } from "../schemas/create-challenge-schema"
import { $createChallenge } from "../services/create-challenge"

const { uploadFiles } = genUploader<UploadRouter>({
	package: "uploadthing"
})

export const useCreateChallenge = () => {
	const createChallenge = useServerFn($createChallenge)

	return useMutation({
		mutationFn: async (props: CreateChallengeData) => {
			const { challengeCover } = props

			if (!challengeCover?.[0]) {
				throw new Error("É necessário adicionar uma imagem de capa.")
			}

			const challenge = await createChallenge({ data: props })
			await uploadFiles("challengeCover", {
				files: [challengeCover[0]],
				input: { challengeId: challenge.challengeId }
			})
		},
		onSuccess: () => {
			toast.success("Desafio criado com sucesso!")
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar desafio.")
		}
	})
}

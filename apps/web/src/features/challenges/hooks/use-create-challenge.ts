import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/libs/api"

type Block =
	| {
			type: "text"
			content: {
				text: string
			}
	  }
	| {
			type: "figma"
			content: {
				url: string
			}
	  }

interface CreateChallengeData {
	title: string
	tagsId: string[]
	description: string
	blocks: Block[]
	difficulty: "easy" | "medium" | "hard" | "expert"
	status: "draft" | "published" | "archived"
	categoryId: string
	experienceForCompletion: number
	challengeCover: FileList
	resources?: {
		title: string
		description: string
		type: "documentation" | "tutorial"
		url: string
	}[]
}

export const useCreateChallenge = () => {
	return useMutation({
		mutationFn: async (props: CreateChallengeData) => {
			const { challengeCover, ...data } = props

			if (!challengeCover?.[0]) {
				throw new Error("É necessário adicionar uma imagem de capa.")
			}

			const challenge = await api.challenge
				.$post({
					json: { ...data }
				})
				.then((res) => res.json())

			await api.upload.challenge.cover.$post({
				form: {
					file: challengeCover[0],
					challengeId: challenge.data.challengeId
				}
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

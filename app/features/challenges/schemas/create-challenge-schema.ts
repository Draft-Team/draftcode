import { z } from "zod"

export const CreateChallengeSchema = z.object({
	challengeCover: z.custom<FileList>().refine(
		(value) => {
			return value !== undefined && value.length > 0
		},
		{
			message: "É necessário adicionar uma imagem de capa."
		}
	),
	title: z
		.string()
		.min(5, "Título deve ter no mínimo 5 caracteres")
		.max(50, "Título deve ter no máximo 50 caracteres"),
	tagsId: z.array(z.string(), {
		required_error: "Pelo menos uma tag é obrigatória"
	}),
	resources: z
		.array(
			z.object({
				title: z
					.string()
					.min(5, "Título deve ter no mínimo 5 caracteres")
					.max(50, "Título deve ter no máximo 50 caracteres"),
				description: z
					.string()
					.min(10, "Descrição deve ter no mínimo 10 caracteres")
					.max(500, "Descrição deve ter no máximo 500 caracteres"),
				type: z.enum(["documentation", "tutorial"], {
					required_error: "Tipo é obrigatório"
				}),
				url: z.string().url({ message: "URL inválida" })
			})
		)
		.optional(),
	description: z
		.string()
		.min(10, "Descrição deve ter no mínimo 10 caracteres")
		.max(500, "Descrição deve ter no máximo 500 caracteres"),
	blocks: z.string().min(1).max(1000).default("WIP"), // TODO: Add block schema
	difficulty: z.enum(["easy", "medium", "hard", "expert"], {
		required_error: "Dificuldade é obrigatória"
	}),
	status: z.enum(["draft", "published", "archived"], {
		required_error: "Status é obrigatório"
	}),
	categoryId: z.string({
		required_error: "Categoria é obrigatória"
	}),
	experienceForCompletion: z.coerce
		.number({
			message: "Experiência deve ser um número",
			required_error: "Experiência é obrigatória"
		})
		.int()
		.min(1, "Experiência deve ser maior que 0")
})

export type CreateChallengeData = z.infer<typeof CreateChallengeSchema>

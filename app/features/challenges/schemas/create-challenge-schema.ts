import { z } from "zod"

export const CreateChallengeSchema = z.object({
	challengeCover: z.custom<FileList>(),
	title: z
		.string()
		.min(5, "Título deve ter no mínimo 5 caracteres")
		.max(50, "Título deve ter no máximo 50 caracteres"),
	tagsId: z.array(z.string().min(1).max(50)),
	description: z
		.string()
		.min(10, "Descrição deve ter no mínimo 10 caracteres")
		.max(500, "Descrição deve ter no máximo 500 caracteres"),
	difficulty: z.union(
		[z.literal("easy"), z.literal("medium"), z.literal("hard"), z.literal("expert")],
		{ message: "Dificuldade inválida" }
	),
	categoryId: z.string().min(1).max(50)
})

export type CreateChallengeData = z.infer<typeof CreateChallengeSchema>

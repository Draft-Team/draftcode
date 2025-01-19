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
	blocks: z.string().min(1).max(1000).default(""), // TODO: Add block schema
	difficulty: z.union(
		[z.literal("easy"), z.literal("medium"), z.literal("hard"), z.literal("expert")],
		{ message: "Dificuldade inválida" }
	),
	status: z.union([z.literal("draft"), z.literal("published"), z.literal("archived")], {
		message: "Status inválido"
	}),
	categoryId: z.string().min(1).max(50),
	experienceForCompletion: z.number().int().min(1, "Experiência deve ser maior que 0")
})

export type CreateChallengeData = z.infer<typeof CreateChallengeSchema>

import { z } from "zod"

export const CreateTagSchema = z.object({
	name: z
		.string()
		.min(2, "Nome deve ter no mínimo 2 caracteres")
		.max(10, "Nome deve ter no máximo 10 caracteres")
})

export type CreateTagData = z.infer<typeof CreateTagSchema>

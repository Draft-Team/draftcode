import { z } from "zod"

export const CreateCategorySchema = z.object({
	name: z
		.string()
		.min(3, "Nome deve ter no mínimo 3 caracteres")
		.max(20, "Nome deve ter no máximo 20 caracteres")
})

export type CreateCategoryData = z.infer<typeof CreateCategorySchema>

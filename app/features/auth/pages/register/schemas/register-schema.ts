import { z } from "zod"

export const RegisterSchema = z.object({
	email: z.string().email("Endereço de email inválido"),
	name: z
		.string()
		.min(2, "Nome deve ter no mínimo 2 caracteres")
		.max(100, "Nome deve ter no máximo 100 caracteres"),
	password: z
		.string()
		.min(6, "Senha deve ter no mínimo 6 caracteres")
		.max(100, "Senha deve ter no máximo 100 caracteres")
})

export type RegisterData = z.infer<typeof RegisterSchema>

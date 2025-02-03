import { z } from "zod"

export const RegisterSchema = z.object({
	email: z.string().email("Endereço de email inválido"),
	name: z
		.string({
			required_error: "Nome é obrigatório"
		})
		.min(3, "Nome deve ter no mínimo 3 caracteres")
		.max(50, "Nome deve ter no máximo 50 caracteres"),
	password: z
		.string()
		.min(6, "Senha deve ter no mínimo 6 caracteres")
		.max(100, "Senha deve ter no máximo 100 caracteres")
})

export type RegisterData = z.infer<typeof RegisterSchema>

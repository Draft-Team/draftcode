import { z } from "zod"

export const LoginSchema = z.object({
	email: z.string().email("Preencha o campo corretamente"),
	password: z
		.string()
		.min(6, "Preencha o campo corretamente")
		.max(100, "Preencha o campo corretamente")
})

export type LoginData = z.infer<typeof LoginSchema>

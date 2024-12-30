import { z } from "zod"

export const ProfileSchema = z.object({
	bio: z
		.string()
		.min(3, { message: "A bio deve ter pelo menos 3 caracteres." })
		.max(255, { message: "A bio não pode ter mais de 255 caracteres." })
		.default("")
})

export type ProfileData = z.infer<typeof ProfileSchema>

import { z } from "zod"

export const ProfileSchema = z.object({
	bio: z
		.string()
		.min(3, { message: "A bio deve ter pelo menos 3 caracteres." })
		.max(255, { message: "A bio não pode ter mais de 255 caracteres." })
		.default(""),
	socialLinks: z.array(
		z.object({
			platform: z.enum(["github", "linkedin", "twitch", "youtube", "website"]),
			url: z.string().url("Must be a valid URL").or(z.literal("")),
			active: z.boolean()
		})
	)
})

export type ProfileData = z.infer<typeof ProfileSchema>

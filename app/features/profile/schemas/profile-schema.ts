import { z } from "zod"

const validatePlatformUrl = (platform: string) => {
	const platformValidators: Record<string, RegExp> = {
		github: /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+(\/[\w-]+)*\/?$/,
		linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+(\/[\w-]+)*\/?$/,
		twitch: /^(https?:\/\/)?(www\.)?twitch\.tv\/[\w-]+(\/[\w-]+)*\/?$/,
		youtube: /^(https:\/\/www\.youtube\.com\/@[\w-]+(\/[\w-]+)*\/?$)/,
		website: /^(https:\/\/)[\w.-]+\.[a-z]{2,6}(\/[\w-]*)*\/?$/
	}

	return platformValidators[platform] ?? /^https?:\/\/.+/
}

export const ProfileSchema = z.object({
	bio: z
		.string()
		.min(3, { message: "A bio deve ter pelo menos 3 caracteres." })
		.max(255, { message: "A bio não pode ter mais de 255 caracteres." })
		.optional()
		.nullable(),
	profileCover: z.custom<FileList | undefined>(),
	profileAvatar: z.custom<FileList | undefined>(),
	githubUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("github").test(url), {
			message: "O link do GitHub não corresponde ao formato correto."
		}),
	linkedinUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("linkedin").test(url), {
			message: "O link do LinkedIn não corresponde ao formato correto."
		}),
	twitchUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("twitch").test(url), {
			message: "O link do Twitch não corresponde ao formato correto."
		}),
	youtubeUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("youtube").test(url), {
			message: "O link do YouTube não corresponde ao formato correto."
		}),
	websiteUrl: z
		.string()
		.optional()
		.refine((url) => !url || validatePlatformUrl("website").test(url), {
			message: "O link do Website não corresponde ao formato correto."
		})
})

export type ProfileData = z.infer<typeof ProfileSchema>

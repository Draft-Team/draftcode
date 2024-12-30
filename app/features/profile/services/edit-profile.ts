import { createServerFn } from "@tanstack/start"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/server/db/client"
import { profilesTable } from "@/server/db/schema"
import { authedMiddleware } from "@/server/utils/middlewares"

export const $editprofile = createServerFn({ method: "POST" })
	.middleware([authedMiddleware])
	.validator(
		z.object({
			bio: z
				.string()
				.min(3, { message: "A bio deve ter pelo menos 3 caracteres." })
				.max(255, { message: "A bio não pode ter mais de 255 caracteres." })
				.default("")
		})
	)
	.handler(async ({ data, context }) => {
		const updatedProfile = await db
			.update(profilesTable)
			.set({ bio: data.bio })
			.where(eq(profilesTable.userId, context.user.id))
			.returning()
			.get()

		if (!updatedProfile) {
			throw new Error("Perfil não encontrado ou erro ao atualizar")
		}

		return { message: "Perfil atualizado com sucesso" }
	})

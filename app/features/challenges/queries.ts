import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/start"

import { db } from "@/server/db/client"
import { categoriesTable, tagsTable } from "@/server/db/schema"

const challengeQueryKeys = {
	tags: ["tags"] as const,
	categories: ["categories"] as const
}

const $getTags = createServerFn().handler(async () => {
	return await db.select().from(tagsTable)
})

const $getCategories = createServerFn().handler(async () => {
	return await db.select().from(categoriesTable)
})

export const tagsQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.tags,
	queryFn: async () => await $getTags()
})

export const categoriesQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.categories,
	queryFn: async () => await $getCategories()
})

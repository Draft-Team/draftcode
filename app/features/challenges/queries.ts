import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/start"

import { db } from "@/server/db/client"
import { categoriesTable, tagsTable } from "@/server/db/schema"

import { $getChallenges } from "./services/get-challenges"

const challengeQueryKeys = {
	tags: ["tags"] as const,
	challenges: ["challenges"] as const,
	categories: ["categories"] as const
}

const $getTags = createServerFn().handler(async () => {
	return await db.select().from(tagsTable)
})

const $getCategories = createServerFn().handler(async () => {
	return await db.select().from(categoriesTable)
})

export const challengesQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.challenges,
	queryFn: async () => await $getChallenges()
})

export const tagsQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.tags,
	queryFn: async () => await $getTags()
})

export const categoriesQueryOptions = queryOptions({
	queryKey: challengeQueryKeys.categories,
	queryFn: async () => await $getCategories()
})

import React from "react"
import { api } from "@/libs/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUser } from "@/shared/hooks/use-user"
import { userQueryKeys } from "@/shared/queries"
import { toast } from "sonner"

export const useBookmarkChallenge = ({ challengeId }: { challengeId: string }) => {
	const queryClient = useQueryClient()

	const { bookmarks } = useUser()
	const isBookmarked = bookmarks.includes(challengeId) || false
	const abortControllerRef = React.useRef<AbortController | null>(null)

	React.useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort()
			}
		}
	}, [])

	const mutation = useMutation({
		meta: {
			invalidates: [userQueryKeys.userBookmarks]
		},
		mutationFn: async () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort()
			}

			const controller = new AbortController()
			abortControllerRef.current = controller

			try {
				if (isBookmarked) {
					return await api.challenge.bookmark[":challengeId"].$delete(
						{
							param: { challengeId }
						},
						{
							init: {
								signal: controller.signal
							}
						}
					)
				}

				return await api.challenge.bookmark[":challengeId"].$post(
					{
						param: { challengeId }
					},
					{
						init: {
							signal: controller.signal
						}
					}
				)
			} catch (error) {
				if (error instanceof DOMException && error.name === "AbortError") {
					return
				}

				throw error
			} finally {
				abortControllerRef.current = null
			}
		},
		onMutate: async () => {
			await queryClient.invalidateQueries({ queryKey: userQueryKeys.userBookmarks })
			const previousBookmarks =
				queryClient.getQueryData<string[]>(userQueryKeys.userBookmarks) || []

			const newBookmarks = isBookmarked
				? previousBookmarks.filter((id) => id !== challengeId)
				: [...previousBookmarks, challengeId]

			queryClient.setQueryData(userQueryKeys.userBookmarks, newBookmarks)

			return { previousBookmarks }
		},
		onError: (error, _variables, context) => {
			queryClient.setQueryData(userQueryKeys.userBookmarks, context?.previousBookmarks)
			toast.error(error.message)
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.userBookmarks })
		}
	})

	return {
		...mutation,
		isBookmarked
	}
}

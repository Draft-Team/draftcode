import {
	challengesQueryOptions,
	currentSessionQueryOptions,
	currentUserProfileQueryOptions,
	currentUserQueryOptions
} from "@/shared/queries"
import type { QueryClient } from "@tanstack/react-query"
import { Toaster } from "@draftcode/ui/components/sonner"
import { TailwindIndicator } from "@draftcode/ui/components/tailwind-indicator"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: Root,
	beforeLoad: async ({ context }) => {
		const $user = context.queryClient.ensureQueryData(currentUserQueryOptions)
		const $session = context.queryClient.ensureQueryData(currentSessionQueryOptions)
		const $profile = context.queryClient.ensureQueryData(currentUserProfileQueryOptions)
		const $challenges = context.queryClient.ensureQueryData(challengesQueryOptions)

		const [user, session, profile] = await Promise.all([
			$user,
			$session,
			$profile,
			$challenges
		])

		const isAuthenticated = !!user && !!session

		return {
			user,
			session,
			profile,
			isAuthenticated
		}
	}
})

function Root() {
	return (
		<>
			<Outlet />
			<TailwindIndicator />
			<Toaster />
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	)
}

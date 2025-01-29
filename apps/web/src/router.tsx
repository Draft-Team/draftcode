import { createRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"
import { DefaultCatchBoundary } from "./shared/components/default-catch-boundary"
import { DefaultNotFound } from "./shared/components/default-not-found"
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/react"
import { LoadingProgress } from "./shared/components/loading-progress"

const queryClient = new QueryClient({
	mutationCache: new MutationCache({
		onSuccess: async () => {
			await queryClient.invalidateQueries()
		}
	})
})

export const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: { queryClient },
	defaultPreloadStaleTime: 0,
	Wrap: ({ children }) => (
		<QueryClientProvider client={queryClient}>
			<NuqsAdapter>{children}</NuqsAdapter>
		</QueryClientProvider>
	),
	defaultViewTransition: true,
	defaultPendingComponent: () => <LoadingProgress />,
	defaultNotFoundComponent: () => <DefaultNotFound />,
	defaultErrorComponent: (error) => <DefaultCatchBoundary {...error} />
})

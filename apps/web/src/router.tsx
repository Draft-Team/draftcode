import { createRouter } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"
import { matchQuery } from "@tanstack/react-query"
import { DefaultCatchBoundary } from "./shared/components/default-catch-boundary"
import { DefaultNotFound } from "./shared/components/default-not-found"
import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/react"
import { LoadingProgress } from "./shared/components/loading-progress"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: Number.POSITIVE_INFINITY
		}
	},
	mutationCache: new MutationCache({
		onSuccess: (_data, _variables, _context, mutation) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					mutation.meta?.invalidates?.some((queryKey) =>
						matchQuery({ queryKey }, query)
					) ?? true
			})
		}
	})
})

export const router = createRouter({
	routeTree,
	scrollRestoration: true,
	defaultPreload: "intent",
	context: { queryClient },
	defaultPreloadStaleTime: 0,
	scrollRestorationBehavior: "smooth",
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

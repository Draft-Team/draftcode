import { createRouter as createTanStackRouter } from "@tanstack/react-router"

import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { routerWithQueryClient } from "@tanstack/react-router-with-query"
import { NuqsAdapter } from "nuqs/adapters/react"
import SuperJSON from "superjson"

import { routeTree } from "./routeTree.gen"
import { DefaultCatchBoundary } from "./shared/components/default-catch-boundary"
import { DefaultNotFound } from "./shared/components/default-not-found"

export function createRouter() {
	const queryClient = new QueryClient({
		mutationCache: new MutationCache({
			onSuccess: () => {
				void queryClient.invalidateQueries()
			}
		}),
		defaultOptions: {
			queries: {
				staleTime: 30 * 1000
			},
			dehydrate: {
				serializeData: SuperJSON.serialize
			},
			hydrate: {
				deserializeData: SuperJSON.deserialize
			}
		}
	})

	const router = createTanStackRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultNotFoundComponent: () => <DefaultNotFound />,
		defaultErrorComponent: (error) => <DefaultCatchBoundary {...error} />,
		defaultPendingComponent: () => <p className="p-2 text-2xl">Loading...</p>,
		Wrap: (props) => {
			return (
				<QueryClientProvider client={queryClient}>
					<NuqsAdapter>{props.children}</NuqsAdapter>
				</QueryClientProvider>
			)
		}
	})

	return routerWithQueryClient(router, queryClient)
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>
	}
}

import type { ReactNode } from "react"
import React from "react"
import {
	createRootRouteWithContext,
	Outlet,
	ScrollRestoration
} from "@tanstack/react-router"

import type { QueryClient } from "@tanstack/react-query"
import { Meta, Scripts } from "@tanstack/start"

import { clientEnv } from "@/environment/client"
import { currentUserProfileQueryOptions } from "@/features/profile/queries"
import { Toaster } from "@/shared/components/ui/sonner"
import { currentSessionQueryOptions, currentUserQueryOptions } from "@/shared/queries"
import css from "@/styles/globals.css?url"

const TailwindIndicator = clientEnv.PROD
	? () => null
	: React.lazy(() =>
			import("@/shared/components/tailwind-indicator").then((res) => ({
				default: res.TailwindIndicator
			}))
		)

const ReactQueryDevTools = clientEnv.PROD
	? () => null
	: React.lazy(() =>
			import("@tanstack/react-query-devtools").then((res) => ({
				default: res.ReactQueryDevtools
			}))
		)

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: RootComponent,
	head: () => ({
		meta: [
			{
				lang: "pt-BR"
			},
			{
				charSet: "utf-8"
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				title: "DraftCode"
			}
		],
		links: [
			{ rel: "stylesheet", href: css },
			{ rel: "icon", href: "/icon.svg" }
		],
		scripts: clientEnv.DEV
			? [
					{
						type: "module",
						children: `import RefreshRuntime from "/_build/@react-refresh";
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type`
					}
				]
			: []
	}),
	beforeLoad: async ({ context }) => {
		const $user = context.queryClient.ensureQueryData(currentUserQueryOptions)
		const $session = context.queryClient.ensureQueryData(currentSessionQueryOptions)
		const $profile = context.queryClient.ensureQueryData(currentUserProfileQueryOptions)

		const [user, session, profile] = await Promise.all([$user, $session, $profile])

		const isAuthenticated = !!user && !!session

		return {
			user,
			session,
			profile,
			isAuthenticated
		}
	}
})

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	)
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html>
			<head>
				<Meta />
			</head>
			<body>
				{children}
				<TailwindIndicator />
				<ReactQueryDevTools initialIsOpen={false} />
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

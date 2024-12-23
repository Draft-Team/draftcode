import type { ReactNode } from "react"
import {
	createRootRouteWithContext,
	Outlet,
	ScrollRestoration
} from "@tanstack/react-router"

import type { QueryClient } from "@tanstack/react-query"
import { Meta, Scripts } from "@tanstack/start"

import {
	currentSessionQueryOptions,
	currentUserQueryOptions
} from "@/features/auth/queries"
import { Toaster } from "@/shared/ui/sonner"
import css from "@/styles/globals.css?url"

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
		]
	}),
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.ensureQueryData(currentUserQueryOptions)
		const session = await context.queryClient.ensureQueryData(currentSessionQueryOptions)

		const isAuthenticated = !!user && !!session

		return {
			user,
			session,
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
				<Toaster />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

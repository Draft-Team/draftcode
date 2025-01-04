import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

import { MainSidebar } from "@/shared/components/app-sidebar/main-sidebar"
import { AutoBreadcrumb } from "@/shared/ui/auto-breadcrumb"
import { Separator } from "@/shared/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/shared/ui/sidebar"

export const Route = createFileRoute("/dashboard/_layout")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/" })
		}
	}
})

function RouteComponent() {
	return (
		<SidebarProvider>
			<MainSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<AutoBreadcrumb />
					</div>
				</header>
				<div className="container my-10 px-3">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}

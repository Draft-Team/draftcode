import { Link } from "@tanstack/react-router"

import { Hash } from "lucide-react"

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@draftcode/ui/components/sidebar"

export const NavContent = () => {
	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild tooltip="Home">
						<Link to="/">
							<Hash />
							<span>Home</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>

				<SidebarMenuItem>
					<SidebarMenuButton asChild tooltip="Dashboard">
						<Link to="/dashboard">
							<Hash />
							<span>Dashboard</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}

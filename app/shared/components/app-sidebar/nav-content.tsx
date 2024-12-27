import { Link } from "@tanstack/react-router"

import { Archive, Folders, Star } from "lucide-react"

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@/shared/ui/sidebar"

export const NavContent = () => {
	return (
		<SidebarGroup>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild tooltip="Favorites">
						<Link to="/">
							<Star />
							<span>Favorites</span>
						</Link>
					</SidebarMenuButton>

					<SidebarMenuButton asChild tooltip="Archived">
						<Link to="/challenges">
							<Archive />
							<span>Archived</span>
						</Link>
					</SidebarMenuButton>

					<SidebarMenuButton asChild tooltip="Categories">
						<Link to="/solutions">
							<Folders />
							<span>Categories</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}

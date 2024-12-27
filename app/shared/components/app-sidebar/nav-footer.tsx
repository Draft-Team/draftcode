import { ChevronsUpDown, LogOut } from "lucide-react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { useLogout } from "@/features/auth/hooks/use-logout"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar
} from "@/shared/ui/sidebar"

export const NavFooter = () => {
	const { user } = useAuth()
	const { mutate: logout } = useLogout()
	const { isMobile } = useSidebar()

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton>
							<ChevronsUpDown />
							<span className="truncate text-xs">{user?.email}</span>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}>
						<DropdownMenuItem onClick={() => logout()}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

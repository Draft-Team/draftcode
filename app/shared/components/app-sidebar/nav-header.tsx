import { BrandName } from "@/shared/ui/brand-name"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/shared/ui/sidebar"

export const NavHeader = () => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton>
					<BrandName />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

import { BrandName } from "../ui/brand-name"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

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

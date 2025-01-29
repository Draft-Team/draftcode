import { BrandName } from "../brand-name"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from "@draftcode/ui/components/sidebar"

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

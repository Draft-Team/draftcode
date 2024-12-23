import { Link, linkOptions } from "@tanstack/react-router"

import { ChevronDown } from "lucide-react"

import { Button } from "@/shared/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu"

import { BrandName } from "../ui/brand-name"

export const Header = () => {
	const linkProps = linkOptions({
		activeProps: {
			className: "text-primary"
		}
	})

	return (
		<header className="container mx-auto flex min-h-16 items-center justify-between">
			<div className="flex items-center gap-6">
				<BrandName as="h1" />

				<nav>
					<ul className="flex items-center gap-5 font-semibold leading-6 text-muted-foreground">
						<li>
							<Link to="/" activeProps={linkProps.activeProps}>
								Início
							</Link>
						</li>
						<li>
							<Link to="/challenges" activeProps={linkProps.activeProps}>
								Desafios
							</Link>
						</li>
						<li>
							<Link to="/solutions" activeProps={linkProps.activeProps}>
								Soluções
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			<DropdownMenu>
				<Button variant="secondary" className="border" asChild>
					<DropdownMenuTrigger>
						<img
							className="size-6 rounded-full"
							src="https://avatars.githubusercontent.com/u/94739199?v=4"
							alt="Imagem de perfil"
						/>
						<span className="text-sm font-semibold">Jess</span>
						<ChevronDown />
					</DropdownMenuTrigger>
				</Button>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Team</DropdownMenuItem>
					<DropdownMenuItem>Subscription</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	)
}

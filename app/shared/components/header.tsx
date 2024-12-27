import { Link, linkOptions } from "@tanstack/react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ChevronDown, Menu } from "lucide-react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { cn } from "@/libs/utils"
import { BrandName } from "@/shared/ui/brand-name"
import { Button, buttonVariants } from "@/shared/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/shared/ui/dropdown-menu"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from "@/shared/ui/sheet"

export const Header = () => {
	const { user } = useAuth()
	const { mutate: logout } = useLogout()

	const linkProps = linkOptions({
		activeProps: {
			className:
				'before:content-[">"] font-semibold before:text-primary border-b-2 border-primary text-foreground'
		}
	})

	const NavData = [
		{ to: "/", label: "Inicio" },
		{ to: "/challenges", label: "Desafios" },
		{ to: "/solutions", label: "Soluções" }
	]

	return (
		<header className="container mx-auto flex min-h-16 items-center justify-between">
			<div className="hidden items-center gap-6 sm:flex">
				<Link to="/">
					<BrandName as="h1" />
				</Link>

				<nav>
					<ul className="flex items-center gap-5 font-lexend leading-6 text-muted-foreground">
						{NavData.map((item) => (
							<li>
								<Link to={item.to} className="" activeProps={linkProps.activeProps}>
									{({ isActive }) => {
										return <>{isActive ? item.label : `_${item.label}`}</>
									}}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>

			{user ? (
				<DropdownMenu>
					<Button variant="secondary" className="border" asChild>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage
									src="https://avatars.githubusercontent.com/u/94739199?v=4"
									className="size-6 rounded-full"
									alt="Imagem de perfil"
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>

							<span className="text-sm font-medium">{user.name}</span>
							<ChevronDown />
						</DropdownMenuTrigger>
					</Button>
					<DropdownMenuContent>
						<DropdownMenuLabel>Minha conta</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
							Sair
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button variant="secondary" className="border" asChild>
					<Link to="/login">Entrar</Link>
				</Button>
			)}

			<Sheet>
				<Button variant="secondary" className="border sm:hidden" size="icon" asChild>
					<SheetTrigger>
						<Menu />
					</SheetTrigger>
				</Button>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>
							<BrandName as="p" />
						</SheetTitle>
						<SheetDescription>Encontre o desafio perfeito para você.</SheetDescription>
					</SheetHeader>
					<nav className="mt-10">
						<ul className="flex flex-col items-center gap-5 leading-6 text-muted-foreground [&>*]:w-full">
							{NavData.map((item) => (
								<li>
									<Link
										to={item.to}
										className={cn(
											buttonVariants({ variant: "outline" }),
											"w-full font-medium"
										)}
										activeProps={linkProps.activeProps}>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</SheetContent>
			</Sheet>
		</header>
	)
}

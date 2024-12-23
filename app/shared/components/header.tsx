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
		activeProps: { className: "border-primary" }
	})

	return (
		<header className="container mx-auto flex min-h-16 items-center justify-between">
			<div className="hidden items-center gap-6 sm:flex">
				<BrandName as="h1" />

				<nav>
					<ul className="flex items-center gap-5 font-semibold leading-6 text-muted-foreground">
						<li>
							<Link
								to="/"
								className={cn(buttonVariants({ variant: "outline" }), "font-semibold")}
								activeProps={linkProps.activeProps}>
								Início
							</Link>
						</li>
						<li>
							<Link
								to="/challenges"
								className={cn(buttonVariants({ variant: "outline" }), "font-semibold")}
								activeProps={linkProps.activeProps}>
								Desafios
							</Link>
						</li>
						<li>
							<Link
								to="/solutions"
								className={cn(buttonVariants({ variant: "outline" }), "font-semibold")}
								activeProps={linkProps.activeProps}>
								Soluções
							</Link>
						</li>
					</ul>
				</nav>
			</div>

			{user ? (
				<DropdownMenu>
					<Button variant="secondary" className="border" asChild>
						<DropdownMenuTrigger>
							<Avatar>
								<AvatarImage
									src="https://github.com/shadcn.png"
									className="size-6 rounded-full"
									alt="Imagem de perfil"
								/>
								<AvatarFallback>CN</AvatarFallback>
							</Avatar>

							<span className="text-sm font-semibold">{user.name}</span>
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
						<ul className="flex flex-col items-center gap-5 font-semibold leading-6 text-muted-foreground [&>*]:w-full">
							<li>
								<Link
									to="/"
									className={cn(
										buttonVariants({ variant: "outline" }),
										"w-full font-semibold"
									)}
									activeProps={linkProps.activeProps}>
									Início
								</Link>
							</li>
							<li>
								<Link
									to="/challenges"
									className={cn(
										buttonVariants({ variant: "outline" }),
										"w-full font-semibold"
									)}
									activeProps={linkProps.activeProps}>
									Desafios
								</Link>
							</li>
							<li>
								<Link
									to="/solutions"
									className={cn(
										buttonVariants({ variant: "outline" }),
										"w-full font-semibold"
									)}
									activeProps={linkProps.activeProps}>
									Soluções
								</Link>
							</li>
						</ul>
					</nav>
				</SheetContent>
			</Sheet>
		</header>
	)
}

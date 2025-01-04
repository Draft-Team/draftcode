import { Link, linkOptions, type LinkOptions } from "@tanstack/react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ChevronDown, Menu } from "lucide-react"

import { useAuth } from "@/features/auth/hooks/use-auth"
import { useLogout } from "@/features/auth/hooks/use-logout"
import { useProfile } from "@/features/profile/hooks/use-profile"
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
	const { profile } = useProfile()
	const { mutate: logout } = useLogout()

	const linkProps = linkOptions({
		activeProps: { className: cn(buttonVariants({ variant: "default" })) }
	})

	const navData: { to: LinkOptions["to"]; label: string }[] = [
		{ to: "/", label: "Inicio" },
		{ to: "/challenges", label: "Desafios" },
		{ to: "/solutions", label: "Soluções" }
	]

	return (
		<header className="container mx-auto flex min-h-16 items-center justify-between">
			<div className="hidden items-center gap-6 sm:flex">
				<BrandName as="h1" />

				<nav>
					<ul className="flex items-center gap-5 leading-6 text-muted-foreground">
						{navData.map(({ to, label }) => (
							<li key={to}>
								<Link
									to={to}
									className={cn(buttonVariants({ variant: "ghost" }), "font-medium")}
									activeProps={linkProps.activeProps}>
									{label}
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
									src={
										profile?.images.find((image) => image.type === "profile-avatar")?.url
									}
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
							{navData.map(({ to, label }) => (
								<li key={to}>
									<Link
										to={to}
										className={cn(
											buttonVariants({ variant: "outline" }),
											"w-full font-medium"
										)}
										activeProps={linkProps.activeProps}>
										{label}
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

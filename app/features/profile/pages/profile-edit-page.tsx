import { Link } from "@tanstack/react-router"

import { ArrowLeft } from "lucide-react"

import { cn } from "@/libs/utils"
import { buttonVariants } from "@/shared/components/ui/button"

import { ProfileForm } from "../components/profile-form"

export const ProfileEditPage = () => {
	return (
		<main className="container">
			<Link
				to="/profile"
				className={cn(buttonVariants({ variant: "outline" }), "font-medium")}>
				<ArrowLeft /> Voltar ao perfil
			</Link>

			<ProfileForm />
		</main>
	)
}

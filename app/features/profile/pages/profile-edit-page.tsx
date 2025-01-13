import { Link } from "@tanstack/react-router"

import { ArrowLeft } from "lucide-react"

import { cn } from "@/libs/utils"
import { buttonVariants } from "@/shared/components/ui/button"
import { HeroSection, HeroSectionContent } from "@/shared/components/ui/hero-section"

import { ProfileForm } from "../components/profile-form"

export const ProfileEditPage = () => {
	return (
		<main className="space-y-4">
			<HeroSection>
				<HeroSectionContent className="flex items-center justify-between">
					<div>
						<h2 className="text-4xl font-bold">Perfil</h2>
						<p className="text-muted-foreground">
							Edite as informações do seu perfil e adicione suas redes sociais.
						</p>
					</div>

					<Link
						to="/profile"
						className={cn(buttonVariants({ variant: "outline" }), "mb-4 font-medium")}>
						<ArrowLeft /> Voltar ao perfil
					</Link>
				</HeroSectionContent>
			</HeroSection>

			<div className="container">
				<ProfileForm />
			</div>
		</main>
	)
}

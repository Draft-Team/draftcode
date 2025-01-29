import type React from "react"
import { Link } from "@tanstack/react-router"

import { ChevronLeft } from "lucide-react"

import { Button } from "@draftcode/ui/components/button"

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="container relative">
			<Button className="absolute m-10 ml-0" asChild variant="outline">
				<Link to="/">
					{" "}
					<ChevronLeft /> Voltar ao site
				</Link>
			</Button>

			<div className="container flex h-screen items-center justify-center">
				{children}
			</div>
		</main>
	)
}

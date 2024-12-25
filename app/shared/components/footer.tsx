import { ChevronsUp } from "lucide-react"

import { BrandName } from "../ui/brand-name"

export const Footer = () => {
	return (
		<footer className="container mx-auto mt-40 space-y-10">
			<section className="grid sm:grid-cols-2">
				<div className="space-y-4 text-center sm:text-start">
					<BrandName as="p" />
					<p className="text-muted-foreground">Encontre o desafio perfeito para você.</p>
				</div>

				<div className="place-content-end space-y-4 sm:flex sm:gap-10 sm:space-y-0 lg:gap-20">
					<div className="space-y-4 text-center sm:text-start">
						<p className="text-sm font-semibold uppercase">Links</p>
						<p className="text-muted-foreground">Desafios</p>
					</div>
					<div className="space-y-4 text-center sm:text-start">
						<p className="text-sm font-semibold uppercase">Recursos</p>
						<p className="text-muted-foreground">Blog</p>
					</div>
					<div className="space-y-4 text-center sm:text-start">
						<p className="text-sm font-semibold uppercase">Legal</p>
						<p className="text-muted-foreground">Termos de uso</p>
						<p className="text-muted-foreground">Política de privacidade</p>
						<p className="text-muted-foreground">Política de cookies</p>
					</div>
				</div>
			</section>
			<section className="grid h-20 border-t-2 sm:grid-cols-2">
				<p className="order-2 self-center justify-self-center text-center text-sm sm:order-1 sm:justify-self-start">
					© 2024 DraftCode Team. Todos os direitos reservados.
				</p>
				<p className="order-1 self-center justify-self-center text-center text-sm sm:order-2 sm:justify-self-end">
					Voltar para topo <ChevronsUp className="inline text-primary" />
				</p>
			</section>
		</footer>
	)
}

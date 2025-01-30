import { useSuspenseQuery } from "@tanstack/react-query"
import { Star } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@draftcode/ui/components/card"
import { HeroSection } from "@/shared/components/hero-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@draftcode/ui/components/tabs"
import { useUser } from "@/shared/hooks/use-user"

import { Leaderboard } from "../components/leaderboard"
import { columns } from "../components/table/columns"
import { DataTable } from "../components/table/data-table"
import { rankingQueryOption } from "../queries"
import { BrandName } from "@/shared/components/brand-name"

export const RankingsPage = () => {
	const { data: rankings } = useSuspenseQuery(rankingQueryOption)
	const { user } = useUser()

	const getRowClassName = (row: { email: string }) => {
		return row.email === user?.email ? "bg-primary/10" : ""
	}

	return (
		<main>
			<HeroSection>
				<div className="container">
					<h2 className="text-4xl font-bold">Ranking de Usuários</h2>
					<p className="text-muted-foreground">
						Veja quem está no topo! Acumule pontos concluindo desafios.
					</p>
				</div>
			</HeroSection>

			<section className="container mt-6 flex flex-col gap-4">
				<h1 className="text-3xl font-bold">Destaques</h1>
				<Tabs defaultValue="geral" className="space-y-4">
					<TabsList>
						<TabsTrigger value="geral">Pontos</TabsTrigger>
					</TabsList>
					<TabsContent value="geral" className="space-y-4">
						<Leaderboard title="Pontos" entries={rankings} />
					</TabsContent>
				</Tabs>
			</section>

			<section className="container mt-6 space-y-4">
				<h1 className="text-3xl font-bold">Ranking</h1>
				<DataTable columns={columns} data={rankings} getRowClassName={getRowClassName} />
			</section>

			<section className="container space-y-4">
				<h1 className="text-3xl font-bold">Como Ganhar Pontos?</h1>
				<Card className="rounded-[2px] border bg-secondary">
					<CardHeader>
						<CardTitle className="text-xl">Concluir Desafios</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p>
							São 4 níveis de dificuldade que servem apenas como referência da
							complexidade do desafio.
						</p>
						<ul className="space-y-2">
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Fácil</span>
							</li>
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Médio</span>
							</li>
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Difícil</span>
							</li>
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Expert</span>
							</li>
						</ul>
						<p>
							A pontuação é definida independentemente pelo <BrandName as="span" /> e pode
							variar de acordo com outros fatores como tempo necessário, impacto ou
							relevância do desafio.
						</p>
					</CardContent>
				</Card>
			</section>
		</main>
	)
}

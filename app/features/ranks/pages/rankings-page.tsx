import { Star } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { HeroSection } from "@/shared/components/ui/hero-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs"

import { Leaderboard } from "../components/leaderboard"
import { columns } from "../components/table/columns"
import { DataTable } from "../components/table/data-table"
import { FakeRankingData, fakeRankingsData } from "../constants/fake-rankings-data"

export const RankingsPage = () => {
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
						<TabsTrigger value="concluidos">Desafios Concluídos</TabsTrigger>
						<TabsTrigger value="conquistas">Conquistas</TabsTrigger>
					</TabsList>
					<TabsContent value="geral" className="space-y-4">
						<Leaderboard title="Pontos" entries={fakeRankingsData} />
					</TabsContent>
					<TabsContent value="concluidos" className="space-y-4">
						<Leaderboard title="Desafios Concluídos" entries={fakeRankingsData} />
					</TabsContent>
					<TabsContent value="conquistas" className="space-y-4">
						<Leaderboard title="Conquistas" entries={fakeRankingsData} />
					</TabsContent>
				</Tabs>
			</section>

			<section className="container mt-6 space-y-4">
				<h1 className="text-3xl font-bold">Ranking</h1>
				<DataTable columns={columns} data={FakeRankingData} />
			</section>

			<section className="container space-y-4">
				<h1 className="text-3xl font-bold">Como Ganhar Pontos?</h1>
				<Card className="rounded-[2px] border bg-secondary">
					<CardHeader>
						<CardTitle className="text-xl">Concluir Desafios</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<ul className="space-y-2">
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Fácil: 100 pontos</span>
							</li>
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Intermediário: +150 pontos</span>
							</li>
							<li className="flex items-center gap-2">
								<Star className="h-4 w-4 text-yellow-500" />
								<span>Avançado: +200 pontos</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</section>
		</main>
	)
}

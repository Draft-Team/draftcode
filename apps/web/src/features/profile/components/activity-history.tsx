import { Award, CheckCircle, Share2, Star } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@draftcode/ui/components/tabs"

interface Activity {
	id: number
	type: "challenges" | "solutions" | "badges" | "points"
	description: string
	date: string
}

const activities: Activity[] = [
	{
		id: 1,
		type: "challenges",
		description: 'Completou o desafio "Landing Page Responsiva"',
		date: "2023-07-01"
	},
	{
		id: 2,
		type: "solutions",
		description: 'Compartilhou uma solução para "Formulário de Login Animado"',
		date: "2023-06-28"
	},
	{
		id: 3,
		type: "badges",
		description: 'Desbloqueou o badge "Mestre do Flexbox"',
		date: "2023-06-25"
	},
	{
		id: 4,
		type: "points",
		description: "Ganhou 100 pontos por completar um desafio difícil",
		date: "2023-06-22"
	}
]

export const ProfileActivityHistory = () => {
	return (
		<div className="border bg-card p-6 shadow">
			<h2 className="mb-4 text-xl font-semibold">Histórico de Atividades</h2>
			<Tabs defaultValue="all">
				<TabsList className="mb-4">
					<TabsTrigger value="all">Todos</TabsTrigger>
					<TabsTrigger value="challenges">Desafios</TabsTrigger>
					<TabsTrigger value="solutions">Soluções</TabsTrigger>
					<TabsTrigger value="badges">Badges</TabsTrigger>
				</TabsList>
				{["all", "challenges", "solutions", "badges"].map((tab) => (
					<TabsContent key={tab} value={tab}>
						{activities
							.filter((activity) => tab === "all" || activity.type === tab)
							.map((activity) => (
								<div className="flex items-start space-x-3" key={activity.id}>
									<ActivityIcon type={activity.type} />
									<div>
										<p>{activity.description}</p>
										<p className="text-sm text-gray-500">{activity.date}</p>
									</div>
								</div>
							))}
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

interface ActivityIconProps {
	type: Activity["type"]
}

const ActivityIcon = ({ type }: ActivityIconProps) => {
	switch (type) {
		case "challenges":
			return <CheckCircle className="text-green-500" />
		case "solutions":
			return <Share2 className="text-blue-500" />
		case "badges":
			return <Award className="text-yellow-500" />
		case "points":
			return <Star className="text-purple-500" />
		default:
			return null
	}
}

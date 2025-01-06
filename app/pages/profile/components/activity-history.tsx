import { useState } from "react"

import { Award, CheckCircle, Share2, Star } from "lucide-react"

import { Button } from "@/shared/ui/button"

interface Activity {
	id: number
	type: "challenge" | "solution" | "badge" | "points"
	description: string
	date: string
}

const activities: Activity[] = [
	{
		id: 1,
		type: "challenge",
		description: 'Completou o desafio "Landing Page Responsiva"',
		date: "2023-07-01"
	},
	{
		id: 2,
		type: "solution",
		description: 'Compartilhou uma solução para "Formulário de Login Animado"',
		date: "2023-06-28"
	},
	{
		id: 3,
		type: "badge",
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
	const [filter, setFilter] = useState<"all" | Activity["type"]>("all")

	const filteredActivities =
		filter === "all"
			? activities
			: activities.filter((activity) => activity.type === filter)

	return (
		<div className="mt-4 border bg-card p-6 shadow">
			<h2 className="mb-4 text-xl font-semibold">Histórico de Atividades</h2>
			<div className="mb-4 flex flex-wrap gap-3 md:flex-nowrap">
				<FilterButton
					label="Todos"
					value="all"
					currentFilter={filter}
					setFilter={setFilter}
				/>
				<FilterButton
					label="Desafios"
					value="challenge"
					currentFilter={filter}
					setFilter={setFilter}
				/>
				<FilterButton
					label="Soluções"
					value="solution"
					currentFilter={filter}
					setFilter={setFilter}
				/>
				<FilterButton
					label="Badges"
					value="badge"
					currentFilter={filter}
					setFilter={setFilter}
				/>
			</div>
			<ul className="space-y-4">
				{filteredActivities.map((activity) => (
					<li key={activity.id} className="flex items-start space-x-3">
						<ActivityIcon type={activity.type} />
						<div>
							<p>{activity.description}</p>
							<p className="text-sm text-gray-500">{activity.date}</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

interface FilterButtonProps {
	label: string
	value: "all" | Activity["type"]
	currentFilter: "all" | Activity["type"]
	setFilter: React.Dispatch<React.SetStateAction<"all" | Activity["type"]>>
}

const FilterButton = ({ label, value, currentFilter, setFilter }: FilterButtonProps) => {
	return (
		<Button
			className="border"
			variant={currentFilter === value ? "default" : "ghost"}
			onClick={() => setFilter(value)}>
			{label}
		</Button>
	)
}

interface ActivityIconProps {
	type: Activity["type"]
}

const ActivityIcon = ({ type }: ActivityIconProps) => {
	switch (type) {
		case "challenge":
			return <CheckCircle className="text-green-500" />
		case "solution":
			return <Share2 className="text-blue-500" />
		case "badge":
			return <Award className="text-yellow-500" />
		case "points":
			return <Star className="text-purple-500" />
		default:
			return null
	}
}

import { BarChart, Star, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export default function ProfileStatistics() {
	return (
		<div className="border bg-card p-6 shadow">
			<h2 className="mb-4 text-xl font-semibold">Estatísticas</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<StatItem icon={Trophy} label="Nível Atual" value="15" />
				<StatItem icon={Star} label="Pontos Acumulados" value="3,750" />
				<StatItem icon={BarChart} label="Ranking Global" value="#237" />
			</div>
			<div className="mt-4">
				<p className="mb-2 text-sm text-muted-foreground">
					Progresso para o próximo nível
				</p>
				<div className="h-2.5 w-full rounded-full bg-gray-200">
					<div className="h-2.5 rounded-full bg-primary" style={{ width: "70%" }}></div>
				</div>
			</div>
		</div>
	)
}

interface StatItemProps {
	icon?: LucideIcon
	label: string
	value: string
}

function StatItem({ icon: Icon, label, value }: StatItemProps) {
	return (
		<div className="flex items-center space-x-3">
			<div className="rounded-full bg-primary p-3">{Icon && <Icon />}</div>
			<div>
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="text-lg font-semibold">{value}</p>
			</div>
		</div>
	)
}

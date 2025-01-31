import { BarChart, Star, Trophy } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useProfile } from "@/shared/hooks/use-profile"
import { LevelSystem } from "@/libs/level-system"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@draftcode/ui/components/tooltip"

export const ProfileStatistics = () => {
	const { profile } = useProfile()
	const totalExperience = profile?.totalExperience ?? 0

	const levelSystem = new LevelSystem()

	const currentLevel = levelSystem.calculateCurrentLevel(totalExperience)
	const experienceForNextLevel =
		levelSystem.calculateExperienceToNextLevel(totalExperience)
	const totalExperienceForCurrentLevel =
		levelSystem.calculateTotalExperienceForLevel(currentLevel)
	const progressPercentage = Math.floor(
		((totalExperience - totalExperienceForCurrentLevel) /
			(levelSystem.calculateTotalExperienceForLevel(currentLevel + 1) -
				totalExperienceForCurrentLevel)) *
			100
	)

	return (
		<div className="border bg-card p-6 shadow">
			<h2 className="mb-4 text-xl font-semibold">Estatísticas</h2>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<StatItem icon={Trophy} label="Nível Atual" value={currentLevel.toString()} />
				<StatItem
					icon={Star}
					label="Pontos Acumulados"
					value={totalExperience.toString()}
				/>
				<StatItem icon={BarChart} label="Ranking Global" value="#000" />
			</div>
			<div className="mt-4">
				<p className="mb-2 text-sm text-muted-foreground">
					Progresso para o próximo nível
				</p>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="h-2.5 w-full rounded-full bg-gray-200">
								<div
									className="h-2.5 rounded-full bg-primary"
									style={{ width: `${progressPercentage}%` }}
								/>
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<p>Só {experienceForNextLevel} XP separando você do próximo nível!</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
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

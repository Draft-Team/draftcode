import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from "@/shared/components/ui/tooltip"

const badges = [
	{
		id: 1,
		name: "Resolutor Criativo",
		description: "Complete 10 desafios com soluções originais",
		date: "2023-05-15",
		unlocked: true
	},
	{
		id: 2,
		name: "Colaborador Ativo",
		description: "Comente em 50 soluções de outros usuários",
		date: "2023-06-22",
		unlocked: true
	},
	{
		id: 3,
		name: "Mestre do CSS",
		description: "Complete todos os desafios de CSS",
		date: null,
		unlocked: false
	}
]

export const ProfileBadges = () => {
	return (
		<div className="h-max border bg-card p-6 shadow">
			<h2 className="mb-4 text-xl font-semibold">Conquistas</h2>
			<div className="flex items-center gap-4">
				{badges.map((badge) => (
					<TooltipProvider key={badge.id}>
						<Tooltip>
							<TooltipTrigger>
								<div className={badge.unlocked ? "opacity-100" : "opacity-50"}>
									<img src="/purple-badge.svg" alt="" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-semibold">{badge.name}</p>
								<p className="text-sm">{badge.description}</p>
								{badge.unlocked && (
									<p className="mt-1 text-xs">Desbloqueado em: {badge.date}</p>
								)}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				))}
			</div>
		</div>
	)
}

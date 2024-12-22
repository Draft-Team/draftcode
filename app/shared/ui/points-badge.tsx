import { CheckCheck } from "lucide-react"

import { cn } from "@/libs/utils"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

interface PointsBadgeProps {
	points: number
	verified?: boolean
	className?: string
}

const PointsBadge = ({ points, verified, className }: PointsBadgeProps) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={cn(
							"flex items-center gap-1 rounded-l-[9px] rounded-r-[8px] bg-white pr-2",
							className,
							verified && "pr-0"
						)}>
						<span
							className={cn(
								"flex items-center rounded-l-[8px] bg-primary p-1 text-sm font-medium text-white",
								verified && "hidden"
							)}>
							DC
						</span>
						<span className={cn("font-medium text-primary", verified && "hidden")}>
							{points > 0 ? `+${points}` : points}
						</span>
						{verified && (
							<div className="flex h-full items-center gap-2 rounded-[8px] bg-primary/10 px-2 text-primary">
								<CheckCheck size={28} />
								<p className="font-medium">Concluido</p>
							</div>
						)}
					</div>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{verified
							? `Você ganhou +${points} pontos nesse desafio.`
							: `Ganhe +${points} pontos nesse desafio.`}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export { PointsBadge }

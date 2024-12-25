import type { LucideIcon } from "lucide-react"

interface BenefitsCardProps {
	icon?: LucideIcon
	title: string
	description: string
}

const BenefitsCard: React.FC<BenefitsCardProps> = ({
	icon: Icon,
	title,
	description
}) => {
	return (
		<div>
			<div className="flex gap-2 font-medium">
				{Icon && <Icon size={24} className="text-primary" />}
				<h4>{title}</h4>
			</div>
			<div className="ml-2 mt-3.5 border-l-4 border-primary">
				<p className="pl-4 text-muted-foreground">{description}</p>
			</div>
		</div>
	)
}

export { BenefitsCard }

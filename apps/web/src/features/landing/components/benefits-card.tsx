import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"

interface BenefitsCardProps {
	icon?: LucideIcon
	title: string
	description: string
	index: number
}

const BenefitsCard = ({ icon: Icon, title, description, index }: BenefitsCardProps) => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.2, delay: index * 0.1 }}
		>
			<div className="flex gap-2 font-medium">
				{Icon && <Icon size={24} className="text-primary" />}
				<h4>{title}</h4>
			</div>
			<div className="ml-2 mt-3.5 border-l-4 border-primary">
				<p className="pl-4 text-muted-foreground">{description}</p>
			</div>
		</motion.div>
	)
}

export { BenefitsCard }

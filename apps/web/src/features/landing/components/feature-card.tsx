import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"

import { Card, CardContent, CardFooter, CardHeader } from "@draftcode/ui/components/card"

interface FeatureCardProps {
	icon?: LucideIcon
	title: string
	description: string
	index: number
}

const FeatureCard = ({ icon: Icon, title, description, index }: FeatureCardProps) => {
	return (
		<motion.div
			className="flex-1"
			initial={{ opacity: 0, x: -100 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			exit={{ opacity: 0, x: -100 }}
			transition={{ duration: 0.2, delay: index * 0.1 }}
		>
			<Card className="h-full rounded-none transition-all duration-150 hover:border-primary">
				<CardHeader>{Icon && <Icon size={24} className="text-primary" />}</CardHeader>
				<CardContent>
					<h3 className="font-bold">{title}</h3>
				</CardContent>
				<CardFooter>
					<p className="text-muted-foreground">{description}</p>
				</CardFooter>
			</Card>
		</motion.div>
	)
}

export { FeatureCard }

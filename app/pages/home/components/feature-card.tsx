import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"

import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card"

interface FeatureCardProps {
	icon?: LucideIcon
	title: string
	description: string
	index: number
}

const FeatureCard: React.FC<FeatureCardProps> = ({
	icon: Icon,
	title,
	description,
	index
}) => {
	return (
		<motion.div
			className="flex-1"
			initial={{ opacity: 0, x: -100 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			exit={{ opacity: 0, x: -100 }}
			animate={{ flex: 1 }}
			whileHover={{ flex: 1.5 }}
			transition={{
				duration: 0.3,
				delay: index * 0.1,
				ease: "easeInOut",
				flex: {
					duration: 0.6,
					ease: [0.4, 0, 0.2, 1],
					type: "tween"
				}
			}}>
			<Card className="h-full rounded-none transition-all duration-300 hover:border-primary">
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

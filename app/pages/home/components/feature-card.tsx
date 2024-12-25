import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card"

interface FeatureCardProps {
	icon?: LucideIcon
	title: string
	description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
	return (
		<Card className="rounded-none transition-all duration-300 hover:border-primary">
			<CardHeader>{Icon && <Icon size={24} className="text-primary" />}</CardHeader>
			<CardContent>
				<h3 className="font-bold">{title}</h3>
			</CardContent>
			<CardFooter>
				<p className="text-muted-foreground">{description}</p>
			</CardFooter>
		</Card>
	)
}

export { FeatureCard }

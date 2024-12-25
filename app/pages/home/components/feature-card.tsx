import type { LucideIcon } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card"

interface FeatureCardProps {
	icon?: LucideIcon
	title: string
	description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
	return (
		<Card className="rounded-none">
			<CardHeader>{Icon && <Icon size={24} color="#A020F0" />}</CardHeader>
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

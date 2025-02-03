import { Trophy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@draftcode/ui/components/avatar"
import { Badge } from "@draftcode/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@draftcode/ui/components/card"

interface LeaderboardEntry {
	name: string
	email: string
	totalExperience: number | null
	imageUrl: string | null
}

interface LeaderboardProps {
	entries: LeaderboardEntry[]
	title: string
}

export const Leaderboard = ({ entries, title }: LeaderboardProps) => {
	return (
		<Card className="w-full rounded-sm bg-secondary">
			<CardHeader className="space-y-1.5">
				<CardTitle className="flex items-center gap-2 text-xl font-bold">
					<Trophy className="h-6 w-6 text-yellow-500" />
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{entries.slice(0, 3).map((entry, index) => (
					<div
						key={entry.email}
						className="flex items-center gap-4 p-3 transition-colors hover:bg-zinc-900"
					>
						<div className="flex h-8 w-8 items-center justify-center bg-primary font-bold">
							{index + 1}
						</div>
						<Avatar className="h-12 w-12 rounded-[4px] border-2">
							<AvatarImage
								src={entry.imageUrl ? entry.imageUrl : "/icon.svg"}
								alt={`${entry.name}'s avatar`}
							/>
							<AvatarFallback>{entry.name[0]}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate text-lg font-semibold">{entry.name}</p>
						</div>
						<Badge
							variant="secondary"
							className="bg-primary text-white hover:bg-primary/50"
						>
							{entry.totalExperience ? entry.totalExperience.toLocaleString() : 0}
						</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	)
}

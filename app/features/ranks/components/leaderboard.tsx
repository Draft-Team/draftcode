import { Trophy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"

interface LeaderboardEntry {
	rank: number
	name: string
	score: number
	avatar: string
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
				{entries.map((entry, index) => (
					<div
						key={index}
						className="flex items-center gap-4 p-3 transition-colors hover:bg-zinc-900">
						<div className="flex h-8 w-8 items-center justify-center bg-primary font-bold">
							{entry.rank}
						</div>
						<Avatar className="h-12 w-12 rounded-[4px] border-2">
							<AvatarImage src={entry.avatar} alt={`${entry.name}'s avatar`} />
							<AvatarFallback>{entry.name[0]}</AvatarFallback>
						</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate text-lg font-semibold">{entry.name}</p>
						</div>
						<Badge
							variant="secondary"
							className="bg-primary text-white hover:bg-primary/50">
							{entry.score.toLocaleString()}
						</Badge>
					</div>
				))}
			</CardContent>
		</Card>
	)
}

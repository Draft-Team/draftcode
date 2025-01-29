import type { ColumnDef } from "@tanstack/react-table"

import { Avatar, AvatarFallback, AvatarImage } from "@draftcode/ui/components/avatar"
import { Badge } from "@draftcode/ui/components/badge"

interface RankingData {
	name: string
	email: string
	totalExperience: number | null
	imageUrl: string | null
	rank: number
}

export const columns: ColumnDef<RankingData>[] = [
	{
		accessorKey: "imageUrl",
		header: "",
		cell: ({ row }) => {
			const imageUrl = row.getValue<string | null>("imageUrl")
			return (
				<Avatar className="h-8 w-8">
					<AvatarImage src={imageUrl ? imageUrl : "/logo.svg"} alt="User Avatar" />
					<AvatarFallback>{row.getValue<string>("name").slice(0, 1)}</AvatarFallback>
				</Avatar>
			)
		}
	},
	{
		accessorKey: "rank",
		header: "Rank"
	},
	{
		accessorKey: "name",
		header: "Nome"
	},
	{
		accessorKey: "email",
		header: ""
	},
	{
		accessorKey: "totalExperience",
		header: "Pontos",
		cell: ({ getValue }) => {
			const value = getValue<number | null>()
			return <Badge>{value ?? 0}</Badge>
		}
	}
]

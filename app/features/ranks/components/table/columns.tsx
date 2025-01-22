import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/shared/components/ui/badge"

interface FakeRankingData {
	rank: number
	pontos: number
	nome: string
}

export const columns: ColumnDef<FakeRankingData>[] = [
	{
		accessorKey: "rank",
		header: "Rank"
	},
	{
		accessorKey: "nome",
		header: "Nome"
	},
	{
		accessorKey: "pontos",
		header: "Pontos",
		cell: ({ getValue }) => {
			return <Badge>{getValue<number>()}</Badge>
		}
	}
]

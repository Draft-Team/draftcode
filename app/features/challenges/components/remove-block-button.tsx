import { ChevronsUpDown, Trash2 } from "lucide-react"

export const RemoveBlockButton = ({
	label,
	onClickRemove
}: {
	label: string
	onClickRemove: () => void
}) => {
	return (
		<button
			onClick={() => onClickRemove()}
			className="flex w-full items-center justify-between gap-1 border bg-muted p-2">
			<span className="text-sm">{label}</span>
			<span className="flex gap-3">
				<Trash2 className="h-5 w-5 text-red-600" />
				<ChevronsUpDown className="h-6 w-6" />
			</span>
		</button>
	)
}

import { type LucideIcon } from "lucide-react"

export const AddBlockButton = ({
	icon,
	label,
	onClickAdd
}: {
	label: string
	icon: LucideIcon
	onClickAdd: () => void
}) => {
	const Icon = icon

	return (
		<button className="w-full flex-col gap-1 border bg-muted p-2" onClick={onClickAdd}>
			<Icon className="m-auto h-6 w-6" />
			<span className="text-sm">{label}</span>
		</button>
	)
}

import { Button } from "@draftcode/ui/components/button"

import { blockTypes } from "./configs/block-config"

export const AddBlockButton = ({
	blockType,
	onClickAdd
}: {
	blockType: keyof typeof blockTypes
	onClickAdd: () => void
}) => {
	const { label, icon: Icon } = blockTypes[blockType]

	return (
		<Button
			variant="outline"
			className="flex h-auto w-full flex-col gap-2"
			onClick={onClickAdd}
		>
			<Icon className="h-5 w-5" />
			<span>{label}</span>
		</Button>
	)
}

import type { DBTypes } from "@/server/db/db-types"

import { FigmaIframeFormBlock } from "./form-blocks/figma-iframe-form-block"
import { TextFormBlock } from "./form-blocks/text-form-block"

const blockComponents = {
	text: TextFormBlock,
	figma: FigmaIframeFormBlock
}

export const RenderFormBlocks = ({
	blocks
}: {
	blocks: DBTypes["challengesTable"]["blocks"]
}) => {
	return blocks.map((block, index) => {
		const BlockComponent = blockComponents[block.type]
		return <BlockComponent key={Math.random() + index} index={index} />
	})
}

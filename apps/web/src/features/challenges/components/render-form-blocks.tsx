import { FigmaIframeFormBlock } from "./form-blocks/figma-iframe-form-block"
import { TextFormBlock } from "./form-blocks/text-form-block"

const blockComponents = {
	text: TextFormBlock,
	figma: FigmaIframeFormBlock
}

type Block =
	| {
			type: "text"
			content: {
				text: string
			}
	  }
	| {
			type: "figma"
			content: {
				url: string
			}
	  }

export const RenderFormBlocks = ({
	blocks
}: {
	blocks: Block[]
}) => {
	return blocks.map((block, index) => {
		const BlockComponent = blockComponents[block.type]
		return <BlockComponent key={Math.random()} index={index} />
	})
}

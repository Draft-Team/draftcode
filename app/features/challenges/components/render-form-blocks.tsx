import { FigmaIframeFormBlock } from "./form-blocks/figma-iframe-form-block"
import { TextFormBlock } from "./form-blocks/text-form-block"

type Block =
	| {
			id: string
			type: "text"
			content: {
				text: string
			}
	  }
	| {
			id: string
			type: "figma"
			content: {
				url: string
			}
	  }

export const RenderFormBlocks = ({ blocks }: { blocks: Block[] }) => {
	return (
		<>
			{blocks.map((block, index) => {
				switch (block.type) {
					case "text":
						return <TextFormBlock index={index} key={block.id} />
					case "figma":
						return <FigmaIframeFormBlock index={index} key={block.id} />
				}
			})}
		</>
	)
}

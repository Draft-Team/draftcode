import type { DBTypes } from "@/server/db/db-types"

import { FigmaIframeFormBlock } from "./form-blocks/figma-iframe-form-block"
import { TextFormBlock } from "./form-blocks/text-form-block"

export const RenderFormBlocks = ({
	blocks
}: {
	blocks: DBTypes["challengesTable"]["blocks"]
}) => {
	return (
		<>
			{blocks.map((block, index) => {
				switch (block.type) {
					case "text":
						return <TextFormBlock index={index} key={Math.random() + index} />
					case "figma":
						return <FigmaIframeFormBlock index={index} key={Math.random() + index} />
				}
			})}
		</>
	)
}

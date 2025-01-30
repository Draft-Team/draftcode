import { Figma, Text } from "lucide-react"

export const blockTypes = {
	text: {
		label: "Texto",
		icon: Text,
		content: {
			text: ""
		}
	},
	figma: {
		label: "Figma",
		icon: Figma,
		content: {
			url: ""
		}
	}
}

export type BlockType = keyof typeof blockTypes

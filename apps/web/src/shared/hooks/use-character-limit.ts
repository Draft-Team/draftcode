import React from "react"

interface CharacterLimitOptions {
	max: number
	value?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

interface CharacterLimitResult {
	isExceeded: boolean
	characterCount: number
	inputProps: {
		onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
		value: string
		maxLength: number
	}
}

export const useCharacterLimit = ({
	max,
	onChange: externalOnChange,
	value: externalValue
}: CharacterLimitOptions): CharacterLimitResult => {
	const isControlled = externalValue !== undefined
	const [internalValue, setInternalValue] = React.useState("")

	const value = isControlled ? externalValue : internalValue
	const characterCount = value.length
	const isExceeded = characterCount === max

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const newValue = event.target.value

			if (!isControlled) {
				setInternalValue(newValue)
			}

			if (externalOnChange) {
				externalOnChange(event)
			}
		},
		[isControlled, externalOnChange]
	)

	const inputProps = React.useMemo(
		() => ({
			onChange: handleChange,
			value,
			maxLength: max
		}),
		[handleChange, value, max]
	)

	return {
		characterCount,
		isExceeded,
		inputProps
	}
}

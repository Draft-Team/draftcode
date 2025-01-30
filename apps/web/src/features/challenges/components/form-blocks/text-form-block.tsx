import { Controller, useFormContext } from "react-hook-form"

import { Label } from "@draftcode/ui/components/label"
import { Separator } from "@draftcode/ui/components/separator"
import { Textarea } from "@draftcode/ui/components/textarea"

import type { CreateChallengeData } from "../../schemas/create-challenge-schema"
import { useCharacterLimit } from "@/shared/hooks/use-character-limit"

export const TextFormBlock = ({ index }: { index: number }) => {
	const {
		control,
		formState: { errors }
	} = useFormContext<CreateChallengeData>()

	const error = errors.blocks?.[index]?.content as {
		text: {
			message: string
		}
	}

	return (
		<section className="border p-3">
			<h3 className="text-xl font-semibold">Texto</h3>
			<p className="text-xs text-muted-foreground" />
			<Separator className="my-3" />
			<Label>Texto</Label>
			<fieldset>
				<Controller
					control={control}
					name={`blocks.${index}.content.text`}
					render={({ field }) => {
						const limit = 100
						const { inputProps, characterCount, isExceeded } = useCharacterLimit({
							max: limit,
							value: field.value,
							onChange: field.onChange
						})

						return (
							<>
								<Textarea {...inputProps} placeholder="Escreva o texto aqui" />
								<div className="flex items-center justify-between">
									{error && <p className="text-red-500">{error.text.message}</p>}
									<span
										className={`text-sm text-left ${isExceeded ? "text-red-500" : "text-muted-foreground"}`}
									>
										{characterCount}/{limit}
									</span>
								</div>
							</>
						)
					}}
				/>
			</fieldset>
		</section>
	)
}

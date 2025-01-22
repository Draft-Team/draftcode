import { useFormContext } from "react-hook-form"

import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"
import { Textarea } from "@/shared/components/ui/textarea"

import type { CreateChallengeData } from "../../schemas/create-challenge-schema"

export const TextFormBlock = ({ index }: { index: number }) => {
	const {
		register,
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
			<p className="text-xs text-muted-foreground"></p>
			<Separator className="my-3" />
			<fieldset>
				<Label>Texto</Label>
				<Textarea
					placeholder="Escreva o texto aqui"
					{...register(`blocks.${index}.content.text`)}
				/>
				{error && <p className="text-red-500">{error.text.message}</p>}
			</fieldset>
		</section>
	)
}

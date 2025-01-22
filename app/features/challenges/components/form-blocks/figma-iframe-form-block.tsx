import { useFormContext } from "react-hook-form"

import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"

import type { CreateChallengeData } from "../../schemas/create-challenge-schema"

export const FigmaIframeFormBlock = ({ index }: { index: number }) => {
	const {
		register,
		watch,
		formState: { errors }
	} = useFormContext<CreateChallengeData>()

	const error = errors.blocks?.[index]?.content as {
		url: {
			message: string
		}
	}

	const url = watch(`blocks.${index}.content.url`)

	return (
		<section className="border p-3">
			<h3 className="text-xl font-semibold">Figma</h3>
			<p className="text-xs text-muted-foreground">
				Insira o link do Figma (modo compartilhado para visualização).
			</p>
			<Separator className="my-3" />
			<fieldset>
				<Label>Link</Label>
				<div className="mb-3">
					<Input
						placeholder="https://www.figma.com/file/..."
						{...register(`blocks.${index}.content.url`)}
					/>
					{error && <p className="text-red-500">{error.url.message}</p>}
				</div>
				<figure className="h-[300px] rounded-sm border">
					<iframe
						allowFullScreen
						name="figma-embed"
						aria-label="Figma embed"
						className="h-full w-full rounded-md object-cover"
						src={`https://www.figma.com/embed?embed_host=astra&url=${url}`}
					/>
				</figure>
			</fieldset>
		</section>
	)
}

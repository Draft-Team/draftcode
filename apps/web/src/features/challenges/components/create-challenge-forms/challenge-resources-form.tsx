import { ChevronsDown, Trash2 } from "lucide-react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { cn } from "@draftcode/ui/libs/utils"
import { Button, buttonVariants } from "@draftcode/ui/components/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@draftcode/ui/components/collapsible"
import { Input } from "@draftcode/ui/components/input"
import { Label } from "@draftcode/ui/components/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@draftcode/ui/components/select"
import { Textarea } from "@draftcode/ui/components/textarea"

import type { CreateChallengeData } from "../../schemas/create-challenge-schema"

export const ChallengeResourcesForm = () => {
	const {
		watch,
		control,
		register,
		formState: { errors }
	} = useFormContext<CreateChallengeData>()

	const watchResources = watch("resources")
	const { fields, append, remove } = useFieldArray({
		control,
		name: "resources"
	})

	const hasResourceErrors = (index: number) => {
		return !!(
			errors.resources?.[index]?.title ??
			errors.resources?.[index]?.url ??
			errors.resources?.[index]?.description ??
			errors.resources?.[index]?.type
		)
	}

	return (
		<section className="border p-3">
			<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
				Recursos do desafio (Opcional)
			</h3>
			<form className="space-y-3">
				{fields.map((field, index) => (
					<Collapsible key={field.id}>
						<CollapsibleTrigger
							className={cn(
								buttonVariants({
									variant: hasResourceErrors(index) ? "destructive" : "secondary"
								}),
								"flex w-full items-center justify-between"
							)}
						>
							{watchResources?.[index]?.title &&
							watchResources[index].title.length > 0 ? (
								<span>{watchResources[index].title}</span>
							) : (
								<span>Recurso {index + 1}</span>
							)}

							{hasResourceErrors(index) && <span className="text-sm">Contém erros</span>}

							<div className="flex items-center gap-5">
								<span
									onClick={(e) => {
										e.stopPropagation()
										remove(index)
									}}
								>
									<Trash2 />
								</span>
								<ChevronsDown />
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<fieldset className="space-y-1">
								<Label>Tipo</Label>
								<Controller
									control={control}
									name={`resources.${index}.type`}
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Documentação" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="documentation">Documentação</SelectItem>
												<SelectItem value="tutorial">Tutorial</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
							</fieldset>

							<fieldset className="space-y-1">
								<Label>Título do recurso</Label>
								<Input
									placeholder="Documentação do desafio"
									{...register(`resources.${index}.title`)}
								/>
								{errors.resources?.[index]?.title && (
									<span className="text-red-500">
										{errors.resources[index]?.title.message}
									</span>
								)}
							</fieldset>

							<fieldset className="space-y-1">
								<Label>URL do recurso</Label>
								<Input
									placeholder="https://mdn.com"
									{...register(`resources.${index}.url`)}
								/>
								{errors.resources?.[index]?.url && (
									<span className="text-red-500">
										{errors.resources[index]?.url.message}
									</span>
								)}
							</fieldset>

							<fieldset className="space-y-1">
								<Label>Descrição do recurso</Label>
								<Textarea
									placeholder="Referência oficial para HTML 5"
									{...register(`resources.${index}.description`)}
								/>
								{errors.resources?.[index]?.description && (
									<span className="text-red-500">
										{errors.resources[index]?.description.message}
									</span>
								)}
							</fieldset>
						</CollapsibleContent>
					</Collapsible>
				))}

				<Button
					type="button"
					className="uppercase"
					onClick={() => {
						append({ type: "documentation", title: "", url: "", description: "" })
					}}
				>
					Adicionar recurso
				</Button>
			</form>
		</section>
	)
}

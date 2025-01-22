import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form"

import { CreateCategoryDialog } from "@/features/challenges/components/create-category-dialog"
import { CreateTagDialog } from "@/features/challenges/components/create-tag-dialog"
import { useCreateChallenge } from "@/features/challenges/hooks/use-create-challenge"
import {
	CreateChallengeSchema,
	type CreateChallengeData
} from "@/features/challenges/schemas/create-challenge-schema"
import { Button } from "@/shared/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/components/ui/select"
import { Separator } from "@/shared/components/ui/separator"

import { AddBlockButton } from "../components/add-block-button"
import { ChallengeBasicInfoForm } from "../components/create-challenge-forms/challenge-basic-info-form"
import { ChallengeResourcesForm } from "../components/create-challenge-forms/challenge-resources-form"
import { RemoveBlockButton } from "../components/remove-block-button"
import { RenderFormBlocks } from "../components/render-form-blocks"

export const CreateChallengePage = () => {
	const { mutate, isPending } = useCreateChallenge()

	const methods = useForm<CreateChallengeData>({
		resolver: zodResolver(CreateChallengeSchema),
		defaultValues: {
			experienceForCompletion: 0
		}
	})

	const { fields, append, remove } = useFieldArray({
		control: methods.control,
		name: "blocks"
	})

	const onSubmit = methods.handleSubmit((data) => {
		mutate(data)
	})

	return (
		<FormProvider {...methods}>
			<div className="grid grid-cols-[1fr_360px] gap-3">
				<div className="space-y-3">
					<ChallengeBasicInfoForm />
					<ChallengeResourcesForm />
					<RenderFormBlocks blocks={fields} />
				</div>

				<div className="space-y-3">
					<section className="border p-3">
						<Button
							className="w-full uppercase"
							onClick={onSubmit}
							mode="loading"
							isLoading={isPending}>
							Criar desafio
						</Button>
					</section>

					<section className="border p-3">
						<h3 className="font-lexend text-xl font-medium">Escolha o status inicial</h3>
						<Separator className="my-2" />
						<Controller
							control={methods.control}
							name="status"
							render={({ field }) => (
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="draft">Rascunho</SelectItem>
										<SelectItem value="published">Publicado</SelectItem>
										<SelectItem value="archived">Arquivado</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						{methods.formState.errors.status && (
							<span className="text-red-500">
								{methods.formState.errors.status.message}
							</span>
						)}
					</section>

					<section className="border p-3">
						<h3 className="font-lexend text-xl font-medium">Criar categoria e tag</h3>
						<Separator className="my-2" />
						<div className="flex items-center gap-3">
							<CreateTagDialog />
							<CreateCategoryDialog />
						</div>
					</section>

					<section className="border p-3">
						<h3 className="font-lexend text-xl font-medium">Adicionar bloco</h3>
						<Separator className="my-2" />
						<div className="flex items-center gap-3">
							<AddBlockButton
								blockType="text"
								onClickAdd={() => {
									append({
										type: "text",
										content: {
											text: ""
										}
									})
								}}
							/>

							<AddBlockButton
								blockType="figma"
								onClickAdd={() => {
									append({
										type: "figma",
										content: {
											url: ""
										}
									})
								}}
							/>
						</div>
					</section>

					<section className="border p-3">
						<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
							Blocos adicionados
						</h3>
						<div className="flex flex-col items-center gap-3">
							{fields.map((field, index) => (
								<RemoveBlockButton
									key={field.id}
									type={field.type}
									onClickRemove={() => remove(index)}
								/>
							))}
						</div>
					</section>
				</div>
			</div>
		</FormProvider>
	)
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useSuspenseQueries } from "@tanstack/react-query"
import {
	ChevronsUpDown,
	CodeXml,
	Eye,
	Figma,
	GripVertical,
	ListChecks,
	Trash2
} from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"

import { CreateCategoryDialog } from "@/features/challenges/components/create-category-dialog"
import { CreateTagDialog } from "@/features/challenges/components/create-tag-dialog"
import { useCreateChallenge } from "@/features/challenges/hooks/use-create-challenge"
import { categoriesQueryOptions, tagsQueryOptions } from "@/features/challenges/queries"
import {
	CreateChallengeSchema,
	type CreateChallengeData
} from "@/features/challenges/schemas/create-challenge-schema"
import { cn } from "@/libs/utils"
import { Dropzone } from "@/shared/components/dropzone"
import { Button, buttonVariants } from "@/shared/components/ui/button"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/shared/components/ui/collapsible"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { MultiSelect } from "@/shared/components/ui/multi-select"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/components/ui/select"
import { Textarea } from "@/shared/components/ui/textarea"

export const CreateChallengePage = () => {
	const [tags, categories] = useSuspenseQueries({
		queries: [tagsQueryOptions, categoriesQueryOptions]
	})

	const { mutate, isPending } = useCreateChallenge()

	const {
		watch,
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateChallengeData>({
		resolver: zodResolver(CreateChallengeSchema),
		defaultValues: {
			experienceForCompletion: 1000
		}
	})

	const watchResources = watch("resources")
	const { fields, append, remove } = useFieldArray({
		control,
		name: "resources"
	})

	const onSubmit = handleSubmit((data) => {
		mutate(data)
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
		<div className="grid grid-cols-[1fr_360px] gap-3">
			<div className="space-y-3">
				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Informações do desafio
					</h3>
					<div className="space-y-3">
						<fieldset>
							<Label htmlFor={register("title").name}>Título</Label>
							<Input placeholder="DraftCode" {...register("title")} />
							{errors.title && (
								<span className="text-red-500">{errors.title.message}</span>
							)}
						</fieldset>

						<fieldset>
							<Label htmlFor={register("description").name}>Descrição</Label>
							<Textarea
								placeholder="Descrição para o desafio"
								{...register("description")}
							/>
							{errors.description && (
								<span className="text-red-500">{errors.description.message}</span>
							)}
						</fieldset>

						<fieldset>
							<Label>Experiência por completar</Label>
							<Controller
								control={control}
								name="experienceForCompletion"
								render={({ field }) => (
									<Input
										{...field}
										min="1"
										step="1"
										pattern="[0-9]*"
										inputMode="numeric"
										placeholder="1000"
										onChange={(e) => {
											const value = e.target.value.replace(/[^0-9]/g, "").trim()
											const cleanValue = value.replace(/^0+/, "") || ""
											field.onChange(cleanValue)
										}}
									/>
								)}
							/>
							{errors.experienceForCompletion && (
								<span className="text-red-500">
									{errors.experienceForCompletion.message}
								</span>
							)}
						</fieldset>

						<fieldset>
							<Label>Tags</Label>
							<Controller
								control={control}
								name="tagsId"
								render={({ field }) => (
									<MultiSelect
										maxCount={5}
										placeholder="Selecione as tags"
										onValueChange={field.onChange}
										value={field.value}
										options={
											tags.data?.map((tag) => ({
												label: tag.name,
												value: tag.id
											})) || []
										}
									/>
								)}
							/>
							{errors.tagsId && (
								<span className="text-red-500">{errors.tagsId.message}</span>
							)}
						</fieldset>

						<fieldset className="flex gap-3">
							<div className="w-full">
								<Label htmlFor={register("categoryId").name}>Categoria</Label>
								<Controller
									control={control}
									name="categoryId"
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Categoria" />
											</SelectTrigger>
											<SelectContent>
												{categories.data?.map((category) => (
													<SelectItem key={category.id} value={category.id}>
														{category.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.categoryId && (
									<span className="text-red-500">{errors.categoryId.message}</span>
								)}
							</div>

							<div className="w-full">
								<Label htmlFor={register("difficulty").name}>Dificuldade</Label>
								<Controller
									control={control}
									name="difficulty"
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Dificuldade" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="easy">Fácil</SelectItem>
												<SelectItem value="medium">Médio</SelectItem>
												<SelectItem value="hard">Difícil</SelectItem>
												<SelectItem value="expert">Expert</SelectItem>
											</SelectContent>
										</Select>
									)}
								/>
								{errors.difficulty && (
									<span className="text-red-500">{errors.difficulty.message}</span>
								)}
							</div>
						</fieldset>

						<fieldset>
							<Label>Imagem de capa</Label>
							<Controller
								control={control}
								name="challengeCover"
								render={({ field }) => <Dropzone onFilesAccepted={field.onChange} />}
							/>
							{errors.challengeCover && (
								<span className="text-red-500">{errors.challengeCover.message}</span>
							)}
						</fieldset>
					</div>
				</section>

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
									)}>
									{watchResources?.[index]?.title &&
									watchResources[index].title.length > 0 ? (
										<span>{watchResources[index].title}</span>
									) : (
										<span>Recurso {index + 1}</span>
									)}

									{hasResourceErrors(index) && (
										<span className="text-sm">Contém erros</span>
									)}

									<div className="flex items-center gap-5">
										<span
											onClick={(e) => {
												e.stopPropagation()
												remove(index)
											}}>
											<Trash2 />
										</span>
										<ChevronsUpDown />
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<fieldset>
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

									<fieldset>
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

									<fieldset>
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

									<fieldset>
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
							}}>
							Adicionar recurso
						</Button>
					</form>
				</section>
			</div>

			<div className="space-y-3">
				<section className="border p-3">
					<div className="flex items-center justify-between">
						<Button variant="ghost">
							<Eye />
							Preview
						</Button>

						<Button
							className="uppercase"
							onClick={onSubmit}
							mode="loading"
							isLoading={isPending}>
							Criar
						</Button>
					</div>
				</section>

				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Escolha o status inicial
					</h3>
					<Controller
						control={control}
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
					{errors.status && <span className="text-red-500">{errors.status.message}</span>}
				</section>

				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Criar categoria e tag
					</h3>
					<div className="flex items-center gap-3">
						<CreateTagDialog />
						<CreateCategoryDialog />
					</div>
				</section>

				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Adicionar bloco
					</h3>
					<div className="flex items-center gap-3">
						<button className="w-full flex-col gap-1 border bg-muted p-2">
							<ListChecks className="m-auto h-6 w-6" />
							<span className="text-sm">Check-List</span>
						</button>

						<button className="w-full flex-col gap-1 border bg-muted p-2">
							<CodeXml className="m-auto h-6 w-6" />
							<span className="text-sm">Código</span>
						</button>

						<button className="w-full flex-col gap-1 border bg-muted p-2">
							<Figma className="m-auto h-6 w-6" />
							<span className="text-sm">Figma</span>
						</button>
					</div>
				</section>

				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Blocos adicionados
					</h3>
					<div className="flex flex-col items-center gap-3">
						<button className="flex w-full items-center justify-between gap-1 border bg-muted p-2">
							<span className="text-sm">Check-List</span>
							<span className="flex gap-3">
								<Trash2 className="h-6 w-6 text-red-600" />
								<GripVertical className="h-6 w-6" />
							</span>
						</button>

						<button className="flex w-full items-center justify-between gap-1 border bg-muted p-2">
							<span className="text-sm">Código</span>
							<span className="flex gap-3">
								<Trash2 className="h-6 w-6 text-red-600" />
								<GripVertical className="h-6 w-6" />
							</span>
						</button>

						<button className="flex w-full items-center justify-between gap-1 border bg-muted p-2">
							<span className="text-sm">Figma</span>
							<span className="flex gap-3">
								<Trash2 className="h-6 w-6 text-red-600" />
								<GripVertical className="h-6 w-6" />
							</span>
						</button>
					</div>
				</section>
			</div>
		</div>
	)
}

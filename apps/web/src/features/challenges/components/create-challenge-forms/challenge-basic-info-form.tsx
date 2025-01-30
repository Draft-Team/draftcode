import { useSuspenseQueries } from "@tanstack/react-query"
import { Controller, useFormContext } from "react-hook-form"

import { Dropzone } from "@/shared/components/dropzone"
import { Input } from "@draftcode/ui/components/input"
import { Label } from "@draftcode/ui/components/label"
import { MultiSelect } from "@draftcode/ui/components/multi-select"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@draftcode/ui/components/select"
import { Separator } from "@draftcode/ui/components/separator"
import { Textarea } from "@draftcode/ui/components/textarea"

import { categoriesQueryOptions, tagsQueryOptions } from "../../queries"
import type { CreateChallengeData } from "../../schemas/create-challenge-schema"
import { useCharacterLimit } from "@/shared/hooks/use-character-limit"

export const ChallengeBasicInfoForm = () => {
	const [tags, categories] = useSuspenseQueries({
		queries: [tagsQueryOptions, categoriesQueryOptions]
	})

	const {
		control,
		register,
		formState: { errors }
	} = useFormContext<CreateChallengeData>()

	return (
		<section className="border p-3">
			<h3 className="font-lexend text-xl font-medium">Informações do desafio</h3>
			<Separator className="my-4" />
			<div className="space-y-3">
				<fieldset className="space-y-1">
					<Label htmlFor={register("title").name}>Título</Label>
					<Controller
						control={control}
						name="title"
						render={({ field }) => {
							const limit = 50
							const { inputProps, characterCount, isExceeded } = useCharacterLimit({
								max: limit,
								value: field.value,
								onChange: field.onChange
							})

							return (
								<>
									<Input {...inputProps} placeholder="DraftCode" />
									<div className="flex items-center justify-between">
										{errors.title && (
											<span className="text-red-500">{errors.title.message}</span>
										)}
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

				<fieldset className="space-y-1">
					<Label htmlFor={register("description").name}>Descrição</Label>
					<Controller
						control={control}
						name="description"
						render={({ field }) => {
							const limit = 500
							const { inputProps, characterCount, isExceeded } = useCharacterLimit({
								max: limit,
								value: field.value,
								onChange: field.onChange
							})

							return (
								<>
									<Textarea {...inputProps} placeholder="Descrição para o desafio" />
									<div className="flex items-center justify-between">
										{errors.description && (
											<span className="text-red-500">{errors.description.message}</span>
										)}
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

				<fieldset className="space-y-1">
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
						<span className="text-red-500">{errors.experienceForCompletion.message}</span>
					)}
				</fieldset>

				<fieldset className="space-y-1">
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
					{errors.tagsId && <span className="text-red-500">{errors.tagsId.message}</span>}
				</fieldset>

				<fieldset className="flex gap-3">
					<div className="w-full space-y-1">
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

					<div className="w-full space-y-1">
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

				<fieldset className="space-y-1">
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
	)
}

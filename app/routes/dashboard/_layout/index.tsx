import { createFileRoute } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useSuspenseQueries } from "@tanstack/react-query"
import { CodeXml, Eye, Figma, GripVertical, ListChecks, Plus, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"

import { useCreateCategory } from "@/features/challenges/hooks/use-create-category"
import { useCreateTag } from "@/features/challenges/hooks/use-create-tag"
import { categoriesQueryOptions, tagsQueryOptions } from "@/features/challenges/queries"
import {
	CreateCategorySchema,
	type CreateCategoryData
} from "@/features/challenges/schemas/create-category-schema"
import {
	CreateTagSchema,
	type CreateTagData
} from "@/features/challenges/schemas/create-tag-schema"
import { Dropzone } from "@/shared/components/dropzone"
import { Button } from "@/shared/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/shared/components/ui/dialog"
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

export const Route = createFileRoute("/dashboard/_layout/")({
	component: RouteComponent
})

function RouteComponent() {
	const [tags, categories] = useSuspenseQueries({
		queries: [tagsQueryOptions, categoriesQueryOptions]
	})

	const { mutate: createTag, isPending: isPendingTag } = useCreateTag()
	const { mutate: createCategory, isPending: isPendingCategory } = useCreateCategory()

	const {
		register: registerTag,
		handleSubmit: handleSubmitTag,
		formState: { errors: tagErrors }
	} = useForm<CreateTagData>({
		resolver: zodResolver(CreateTagSchema)
	})

	const {
		register: registerCategory,
		handleSubmit: handleSubmitCategory,
		formState: { errors: categoryErrors }
	} = useForm<CreateCategoryData>({
		resolver: zodResolver(CreateCategorySchema)
	})

	const onSubmitTag = handleSubmitTag((data) => {
		createTag({ data })
	})

	const onSubmitCategory = handleSubmitCategory((data) => {
		createCategory({ data })
	})

	return (
		<div className="grid grid-cols-[1fr_360px] gap-3">
			<div className="space-y-3">
				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Informações do desafio
					</h3>
					<form className="space-y-3">
						<fieldset>
							<Label>Título</Label>
							<Input placeholder="DraftCode" />
						</fieldset>

						<fieldset>
							<Label>Descrição</Label>
							<Textarea placeholder="Descrição para o desafio" />
						</fieldset>

						<fieldset>
							<Label>Tags</Label>
							<MultiSelect
								maxCount={5}
								placeholder="Selecione as tags"
								onValueChange={(value) => console.log(value)}
								options={
									tags.data?.map((tag) => ({
										label: tag.name,
										value: tag.id
									})) || []
								}
							/>
						</fieldset>

						<fieldset>
							<Label>Categoria</Label>
							<div className="flex items-center gap-3">
								<Select>
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

								<Select>
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
							</div>
						</fieldset>

						<fieldset>
							<Label>Imagem de capa</Label>
							<Dropzone />
						</fieldset>
					</form>
				</section>

				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Recursos do desafio (Opcional)
					</h3>
					<form className="space-y-3">
						<fieldset>
							<Label>Tipo</Label>
							<Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Documentação" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="documentation">Documentação</SelectItem>
									<SelectItem value="youtube">YouTube</SelectItem>
									<SelectItem value="tutorial">Tutorial</SelectItem>
								</SelectContent>
							</Select>
						</fieldset>

						<fieldset>
							<Label>Título do recurso</Label>
							<Input placeholder="Documentação do desafio" />
						</fieldset>

						<fieldset>
							<Label>URL do recurso</Label>
							<Input placeholder="https://mdn.com" />
						</fieldset>

						<fieldset>
							<Label>Descrição do recurso</Label>
							<Textarea placeholder="Referência oficial para HTML 5" />
						</fieldset>

						<Button className="uppercase">Adicionar recurso</Button>
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

						<Button className="uppercase">Publicar</Button>
					</div>
				</section>

				<section className="border p-3">
					<h3 className="mb-3 border-b-2 font-lexend text-xl font-medium">
						Criar categoria e tag
					</h3>
					<div className="flex items-center gap-3">
						<Dialog>
							<DialogTrigger asChild>
								<button className="w-full flex-col gap-1 border bg-muted p-2">
									<Plus className="m-auto h-6 w-6" />
									<span className="text-sm">Criar tag</span>
								</button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Dê um nome para sua tag</DialogTitle>
								</DialogHeader>

								<form onSubmit={onSubmitTag} className="space-y-3">
									<fieldset>
										<Label htmlFor={registerTag("name").name}>Nome</Label>
										<Input placeholder="HTML" {...registerTag("name")} />
										{tagErrors.name && (
											<span className="text-red-500">{tagErrors.name.message}</span>
										)}
									</fieldset>

									<Button mode="loading" isLoading={isPendingTag} className="w-full">
										<Plus />
										Adicionar
									</Button>
								</form>
							</DialogContent>
						</Dialog>

						<Dialog>
							<DialogTrigger asChild>
								<button className="w-full flex-col gap-1 border bg-muted p-2">
									<Plus className="m-auto h-6 w-6" />
									<span className="text-sm">Criar categoria</span>
								</button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Dê um nome para sua categoria</DialogTitle>
								</DialogHeader>

								<form onSubmit={onSubmitCategory} className="space-y-3">
									<fieldset>
										<Label htmlFor={registerCategory("name").name}>Nome</Label>
										<Input placeholder="Frontend" {...registerCategory("name")} />
										{categoryErrors.name && (
											<span className="text-red-500">{categoryErrors.name.message}</span>
										)}
									</fieldset>

									<Button mode="loading" isLoading={isPendingCategory} className="w-full">
										<Plus />
										Adicionar
									</Button>
								</form>
							</DialogContent>
						</Dialog>
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

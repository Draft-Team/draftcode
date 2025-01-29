import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@draftcode/ui/components/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@draftcode/ui/components/dialog"
import { Input } from "@draftcode/ui/components/input"
import { Label } from "@draftcode/ui/components/label"

import { useCreateCategory } from "../hooks/use-create-category"
import {
	CreateCategorySchema,
	type CreateCategoryData
} from "../schemas/create-category-schema"

export const CreateCategoryDialog = () => {
	const { mutate, isPending } = useCreateCategory()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateCategoryData>({
		resolver: zodResolver(CreateCategorySchema)
	})

	const onSubmit = (data: CreateCategoryData) => {
		mutate(data)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex h-auto w-full flex-col gap-2" variant="outline">
					<Plus className="h-5 w-5" />
					<span>Criar categoria</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Dê um nome para sua categoria</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<fieldset>
						<Label htmlFor={register("name").name}>Nome</Label>
						<Input placeholder="Frontend" {...register("name")} />
						{errors.name && <span className="text-red-500">{errors.name.message}</span>}
					</fieldset>

					<Button mode="loading" isLoading={isPending} className="w-full">
						<Plus />
						Adicionar
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}

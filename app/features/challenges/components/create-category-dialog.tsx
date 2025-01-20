import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"

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
		mutate({ data })
	}

	return (
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

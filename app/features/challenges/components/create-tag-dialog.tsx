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

import { useCreateTag } from "../hooks/use-create-tag"
import { CreateTagSchema, type CreateTagData } from "../schemas/create-tag-schema"

export const CreateTagDialog = () => {
	const { mutate, isPending } = useCreateTag()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateTagData>({
		resolver: zodResolver(CreateTagSchema)
	})

	const onSubmit = (data: CreateTagData) => {
		mutate({ data })
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="flex h-auto w-full flex-col gap-2" variant="outline">
					<Plus className="h-5 w-5" />
					<span>Criar tag</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Dê um nome para sua tag</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<fieldset>
						<Label htmlFor={register("name").name}>Nome</Label>
						<Input placeholder="HTML" {...register("name")} />
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

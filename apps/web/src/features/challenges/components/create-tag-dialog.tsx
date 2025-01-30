import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import { Controller, useForm } from "react-hook-form"

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

import { useCreateTag } from "../hooks/use-create-tag"
import { CreateTagSchema, type CreateTagData } from "../schemas/create-tag-schema"
import { useCharacterLimit } from "@/shared/hooks/use-character-limit"

export const CreateTagDialog = () => {
	const { mutate, isPending } = useCreateTag()

	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateTagData>({
		resolver: zodResolver(CreateTagSchema)
	})

	const onSubmit = (data: CreateTagData) => {
		mutate(data)
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
						<Controller
							control={control}
							name="name"
							render={({ field }) => {
								const limit = 10
								const { inputProps, characterCount, isExceeded } = useCharacterLimit({
									max: limit,
									value: field.value,
									onChange: field.onChange
								})

								return (
									<>
										<Input {...inputProps} placeholder="HTML" />
										<div className="flex items-center justify-between">
											{errors.name && (
												<span className="text-red-500">{errors.name.message}</span>
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

					<Button mode="loading" isLoading={isPending} className="w-full">
						<Plus />
						Adicionar
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}

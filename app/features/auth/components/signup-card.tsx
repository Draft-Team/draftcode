import { Link } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { PasswordInput } from "@/shared/ui/password-input"

import { useSignup } from "../hooks/use-signup"
import { SignupSchema, type SignupData } from "../schemas/signup-schema"

export const SignupCard = () => {
	const { mutate: signup, isPending } = useSignup()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignupData>({
		resolver: zodResolver(SignupSchema)
	})

	const onSubmit = (data: SignupData) => {
		signup({ data })
	}

	return (
		<form
			className="flex w-full max-w-md flex-col gap-4"
			onSubmit={handleSubmit(onSubmit)}>
			<h1 className="text-2xl font-semibold">Crie sua conta</h1>
			<fieldset className="flex items-center gap-4">
				<Button className="w-full" variant="outline" asChild>
					<a href="/api/login/github">Github</a>
				</Button>
				<Button className="w-full" variant="outline" asChild>
					<a href="/api/login/google">Google</a>
				</Button>
			</fieldset>

			<hr />

			<fieldset className="flex flex-col gap-4">
				<Label className="space-y-2" htmlFor={register("email").name}>
					<span>Email</span>
					<Input {...register("email")} />
					{errors.email && <span className="text-red-500">{errors.email.message}</span>}
				</Label>

				<Label className="space-y-2" htmlFor={register("name").name}>
					<span>Nome</span>
					<Input {...register("name")} />
					{errors.name && <span className="text-red-500">{errors.name.message}</span>}
				</Label>

				<Label className="space-y-2" htmlFor={register("password").name}>
					<span>Senha</span>
					<PasswordInput {...register("password")} />
					{errors.password && (
						<span className="text-red-500">{errors.password.message}</span>
					)}
				</Label>
			</fieldset>

			<Button type="submit" mode="loading" isLoading={isPending}>
				Criar conta
			</Button>

			<div className="flex items-center justify-center gap-4">
				<div className="flex-1 border-t" />
				<span>
					Já tem uma conta?{" "}
					<Link to="/login" className="text-primary hover:underline">
						Acesse
					</Link>
				</span>
				<div className="flex-1 border-t" />
			</div>
		</form>
	)
}

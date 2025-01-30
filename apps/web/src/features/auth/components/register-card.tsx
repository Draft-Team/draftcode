import { Link } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"

import { Button } from "@draftcode/ui/components/button"
import { Input } from "@draftcode/ui/components/input"
import { Label } from "@draftcode/ui/components/label"
import { PasswordInput } from "@draftcode/ui/components/password-input"
import { GithubLogo, GoogleLogo } from "@draftcode/ui/icons"

import { useRegister } from "../hooks/use-register"
import { RegisterSchema, type RegisterData } from "../schemas/register-schema"
import { useCharacterLimit } from "@/shared/hooks/use-character-limit"
import { api } from "@/libs/api"

export const RegisterCard = () => {
	const { mutate: signup, isPending } = useRegister()

	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<RegisterData>({
		resolver: zodResolver(RegisterSchema)
	})

	const onSubmit = (data: RegisterData) => {
		signup(data)
	}

	return (
		<form
			className="flex w-full max-w-md flex-col gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1 className="text-2xl font-semibold">Crie sua conta</h1>
			<fieldset className="flex items-center gap-4">
				<Button className="w-full" variant="outline" asChild>
					<a href={api.login.github.$url().toString()}>
						<GithubLogo />
						Github
					</a>
				</Button>
				<Button className="w-full" variant="outline" asChild>
					<a href={api.login.google.$url().toString()}>
						<GoogleLogo />
						Google
					</a>
				</Button>
			</fieldset>

			<hr />

			<fieldset>
				<Label htmlFor={register("name").name}>Nome</Label>
				<Controller
					control={control}
					name="name"
					render={({ field }) => {
						const limit = 50
						const { inputProps, characterCount, isExceeded } = useCharacterLimit({
							max: limit,
							onChange: field.onChange,
							value: field.value
						})

						return (
							<>
								<Input {...inputProps} />
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

			<fieldset>
				<Label htmlFor={register("email").name}>Email</Label>
				<Input {...register("email")} />
				{errors.email && <span className="text-red-500">{errors.email.message}</span>}
			</fieldset>

			<fieldset>
				<Label htmlFor={register("password").name}>Senha</Label>
				<PasswordInput {...register("password")} />
				{errors.password && (
					<span className="text-red-500">{errors.password.message}</span>
				)}
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

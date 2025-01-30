import { Link } from "@tanstack/react-router"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@draftcode/ui/components/button"
import { Input } from "@draftcode/ui/components/input"
import { Label } from "@draftcode/ui/components/label"
import { PasswordInput } from "@draftcode/ui/components/password-input"
import { GithubLogo, GoogleLogo } from "@draftcode/ui/icons"

import { useLogin } from "../hooks/use-login"
import { LoginSchema, type LoginData } from "../schemas/login-schema"
import { api } from "@/libs/api"

export const LoginCard = () => {
	const { mutate: login, isPending } = useLogin()

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginData>({
		resolver: zodResolver(LoginSchema)
	})

	const onSubmit = (data: LoginData) => {
		login(data)
	}

	return (
		<form
			className="flex w-full max-w-md flex-col gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h1 className="text-2xl font-semibold">Entre na sua conta</h1>
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
				Entrar
			</Button>

			<div className="flex items-center justify-center gap-4">
				<div className="flex-1 border-t" />
				<span>
					Não tem uma conta?{" "}
					<Link to="/register" className="text-primary hover:underline">
						Criar
					</Link>
				</span>
				<div className="flex-1 border-t" />
			</div>
		</form>
	)
}

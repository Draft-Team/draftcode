import { Globe } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"

import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"

import type { ProfileData } from "../schemas/profile-schema"

interface SocialLinkFieldProps {
	placeholder: string
	fieldName: keyof ProfileData
	register: UseFormRegister<ProfileData>
	errors: FieldErrors<ProfileData>
}

export const SocialLinkField = ({
	placeholder,
	fieldName,
	register,
	errors
}: SocialLinkFieldProps) => {
	return (
		<fieldset className="flex flex-col gap-4">
			<Label className="relative flex-grow" htmlFor={fieldName}>
				<Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder={placeholder} className="pl-10" {...register(fieldName)} />
			</Label>
			{errors[fieldName] && (
				<p className="mt-2 text-red-500">{errors[fieldName]?.message}</p>
			)}
		</fieldset>
	)
}

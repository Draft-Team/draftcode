import { useState } from "react"

import { Github, Globe, Linkedin, Plus, Twitch, X, Youtube } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

type SocialLink = {
	platform: "github" | "linkedin" | "twitch" | "youtube" | "website"
	url: string
	active: boolean
}

const socialIcons = {
	github: Github,
	linkedin: Linkedin,
	twitch: Twitch,
	youtube: Youtube,
	website: Globe
}

const initialLinks: SocialLink[] = [
	{ platform: "github", url: "", active: true },
	{ platform: "linkedin", url: "", active: true },
	{ platform: "twitch", url: "", active: false },
	{ platform: "youtube", url: "", active: false },
	{ platform: "website", url: "", active: false }
]

export function SocialMediaLinks() {
	const [links, setLinks] = useState<SocialLink[]>(initialLinks)

	const updateLink = (index: number, url: string) => {
		const newLinks = [...links]
		newLinks[index].url = url
		setLinks(newLinks)
	}

	const toggleLinkActive = (index: number) => {
		const newLinks = [...links]
		newLinks[index].active = !newLinks[index].active
		setLinks(newLinks)
	}

	return (
		<div className="flex flex-col gap-4 border bg-card p-4">
			{links.map((link, index) => {
				const Icon = socialIcons[link.platform]
				return (
					<div key={index} className="flex items-center space-x-2">
						<div className="relative flex-grow">
							<Icon
								className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400"
								size={20}
							/>
							<Input
								type="url"
								placeholder={`Seu perfil ${link.platform}`}
								value={link.url}
								onChange={(e) => updateLink(index, e.target.value)}
								className={`} pl-10`}
								disabled={!link.active}
							/>
						</div>
						<Button
							variant="outline"
							size="icon"
							onClick={() => toggleLinkActive(index)}
							className={
								link.active
									? "text-red-500 hover:text-red-600"
									: "text-green-500 hover:text-green-600"
							}>
							<span className="sr-only">{link.active ? "Desativar" : "Ativar"}</span>
							{link.active ? <X size={20} /> : <Plus size={20} />}
						</Button>
					</div>
				)
			})}
		</div>
	)
}

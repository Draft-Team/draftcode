import React from "react"

import { cn } from "@draftcode/ui/libs/utils"

const HeroSection = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("border-y bg-secondary py-11", className)} {...props} />
	)
)
HeroSection.displayName = "HeroSection"

const HeroSectionContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("container", className)} {...props} />
	)
)
HeroSectionContent.displayName = "HeroSectionContent"

export { HeroSection, HeroSectionContent }

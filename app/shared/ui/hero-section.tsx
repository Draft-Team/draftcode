import React from "react"

import { cn } from "@/libs/utils"

export const HeroSection = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn(className, "border-y bg-secondary py-11")} {...props} />
	)
)

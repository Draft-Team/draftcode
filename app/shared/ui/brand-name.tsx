import React from "react"

import { cn } from "@/libs/utils"

interface BrandNameProps extends Omit<React.ComponentProps<"div">, "children"> {
	as?: React.ElementType
}

const BrandName = React.forwardRef<HTMLDivElement, BrandNameProps>(
	({ className, as, ...props }, ref) => {
		const Comp = as ?? "div"

		return (
			<Comp className={cn("text-lg font-semibold", className)} ref={ref} {...props}>
				Dra
				<span className="text-primary">ft</span>
				Code
			</Comp>
		)
	}
)
BrandName.displayName = "BrandName"

export { BrandName }

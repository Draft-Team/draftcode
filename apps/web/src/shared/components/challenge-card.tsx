import * as React from "react"

import { cn } from "@draftcode/ui/libs/utils"

const ChallengeCard = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex h-full flex-col border bg-card text-card-foreground shadow",
			className
		)}
		{...props}
	/>
))
ChallengeCard.displayName = "ChallengeCard"

const ChallengeCardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("px-3 py-2", className)} {...props} />
))
ChallengeCardHeader.displayName = "ChallengeCardHeader"

const ChallengeCardTitle = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"line-clamp-2 text-2xl font-medium leading-8 tracking-tight",
			className
		)}
		{...props}
	/>
))
ChallengeCardTitle.displayName = "ChallengeCardTitle"

const ChallengeCardDescription = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("line-clamp-2 leading-6 text-muted-foreground", className)}
		{...props}
	/>
))
ChallengeCardDescription.displayName = "ChallengeCardDescription"

const ChallengeCardTag = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("h-6 rounded bg-primary px-1.5 text-foreground", className)}
		{...props}
	/>
))
ChallengeCardTag.displayName = "ChallengeCardTag"

const ChallengeCardImage = React.forwardRef<
	HTMLImageElement,
	React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, ...props }, ref) => (
	<figure className="relative h-48 w-full">
		<img
			ref={ref}
			className={cn("h-full w-full object-cover", className)}
			{...props}
			alt={props.alt || "Challenge Cover"}
		/>
		<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/90" />
	</figure>
))
ChallengeCardImage.displayName = "ChallengeCardImage"

const ChallengeCardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex-1 space-y-4 px-3 py-2", className)} {...props} />
))
ChallengeCardContent.displayName = "ChallengeCardContent"

const ChallengeCardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("mt-4 flex items-center bg-muted px-3 py-2", className)}
		{...props}
	/>
))
ChallengeCardFooter.displayName = "ChallengeCardFooter"

export {
	ChallengeCard,
	ChallengeCardHeader,
	ChallengeCardTitle,
	ChallengeCardDescription,
	ChallengeCardContent,
	ChallengeCardFooter,
	ChallengeCardImage,
	ChallengeCardTag
}

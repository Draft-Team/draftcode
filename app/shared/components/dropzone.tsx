import React from "react"

import { CircleX, CloudUpload, FileIcon } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { cn } from "@/libs/utils"

interface FileWithPreview extends File {
	preview?: string
}

interface DropzoneProps {
	maxSize?: number
	className?: string
	onFilesAccepted?: (files: File[]) => void
}

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 Bytes"

	const k = 1024
	const sizes = ["Bytes", "KB", "MB", "GB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const Dropzone = ({
	className,
	onFilesAccepted,
	maxSize = 2 * 1024 * 1024
}: DropzoneProps) => {
	const [files, setFiles] = React.useState<FileWithPreview[]>([])

	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			const filesWithPreview = acceptedFiles.map((file) => {
				return Object.assign(file, {
					preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined
				})
			})
			setFiles(filesWithPreview)
			onFilesAccepted?.(acceptedFiles)
		},
		[onFilesAccepted]
	)

	React.useEffect(() => {
		return () => {
			files.forEach((file) => {
				if (file.preview) URL.revokeObjectURL(file.preview)
			})
		}
	}, [files])

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		maxSize,
		multiple: false
	})

	const removeFile = (fileToRemove: FileWithPreview) => {
		if (fileToRemove.preview) {
			URL.revokeObjectURL(fileToRemove.preview)
		}
		setFiles(files.filter((f) => f !== fileToRemove))
	}

	return (
		<div className={cn("mx-auto w-full", className)}>
			<div
				{...getRootProps()}
				className="relative cursor-pointer border-2 border-dashed border-primary bg-accent/10 p-8 transition-colors hover:bg-accent/5">
				<input {...getInputProps()} />
				<div className="flex flex-col items-center justify-center gap-2 text-center">
					<CloudUpload className="h-10 w-10 text-primary" />
					<p className="text-sm text-muted-foreground">
						Arraste e solte ou{" "}
						<span className="text-primary hover:underline">clique para navegar</span>
					</p>
					<p className="text-xs text-muted-foreground/70">Max 2 MB</p>
				</div>
			</div>

			{files.length > 0 && (
				<div className="mt-4 space-y-3">
					{files.map((file) => (
						<div key={file.name} className="flex items-center gap-3 border p-3">
							{file.preview ? (
								<img
									src={file.preview || "/placeholder.svg"}
									alt={file.name}
									className="h-10 w-10 object-fill"
									onLoad={() => {
										URL.revokeObjectURL(file.preview!)
									}}
								/>
							) : (
								<div className="flex h-10 w-10 items-center justify-center rounded bg-background">
									<FileIcon className="h-5 w-5 text-muted-foreground" />
								</div>
							)}
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm text-foreground">{file.name}</p>
								<p className="text-xs text-muted-foreground">
									{formatFileSize(file.size)}
								</p>
							</div>
							<button
								onClick={() => removeFile(file)}
								className="ml-2 text-destructive transition-colors hover:text-destructive/70">
								<CircleX className="h-6 w-6" />
								<span className="sr-only">Remove file</span>
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

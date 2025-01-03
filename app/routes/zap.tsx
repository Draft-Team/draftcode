import { createFileRoute } from "@tanstack/react-router"

import { genUploader } from "uploadthing/client"

import type { UploadRouter } from "@/server/upload/uploadthing"

export const Route = createFileRoute("/zap")({
	component: RouteComponent
})

const { uploadFiles } = genUploader<UploadRouter>({
	package: "uploadthing"
})

function RouteComponent() {
	return (
		<div>
			<input
				type="file"
				onChange={async (event) => {
					const file = event.target.files?.[0]

					if (!file) return

					await uploadFiles("imageUploader", { files: [file] })
				}}
			/>
		</div>
	)
}

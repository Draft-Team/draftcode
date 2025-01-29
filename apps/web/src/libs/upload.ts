import { env } from "@/environment/env"
import type { UploadRouter } from "@draftcode/types"
import { genUploader } from "uploadthing/client"

export const { uploadFiles } = genUploader<UploadRouter>({
	package: "uploadthing",
	url: `${env.VITE_BACKEND_URL}/api/uploadthing`
})

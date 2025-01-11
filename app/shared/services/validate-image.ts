export const validateImageDimensions = async (
	file: File,
	minWidth: number,
	minHeight: number
): Promise<void> => {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.src = URL.createObjectURL(file)

		image.onload = () => {
			const { width, height } = image

			URL.revokeObjectURL(image.src)

			if (width < minWidth || height < minHeight) {
				reject(
					new Error(
						`A imagem deve ter no mínimo ${minWidth}x${minHeight} pixels. Dimensões atuais: ${width}x${height}.`
					)
				)
			} else {
				resolve()
			}
		}

		image.onerror = () => {
			URL.revokeObjectURL(image.src)
			reject(new Error("Não foi possível carregar a imagem."))
		}
	})
}

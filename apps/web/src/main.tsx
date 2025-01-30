import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./app"
import type { router } from "./router"

import "@draftcode/ui/global.css"

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
)

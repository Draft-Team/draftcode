import tsconfigpaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [
		tsconfigpaths(),
		TanStackRouterVite({
			quoteStyle: "double",
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts"
		}),
		react()
	]
})

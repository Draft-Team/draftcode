import eslint from "@eslint/js"
import pluginRouter from "@tanstack/eslint-plugin-router"
import importPlugin from "eslint-plugin-import"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
	{
		ignores: [
			".vinxi",
			".output",
			"node_modules",
			"**/*.config.{ts,tsx}",
			"**/routeTree.gen.ts"
		]
	},
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...tseslint.configs.stylisticTypeChecked,
			...tseslint.configs.recommendedTypeChecked,
			...pluginRouter.configs["flat/recommended"]
		],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				projectService: true
			},
			globals: {
				...globals.node,
				...globals.browser
			}
		},
		plugins: {
			react: reactPlugin,
			import: importPlugin,
			"react-hooks": reactHooks
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			...reactPlugin.configs["jsx-runtime"].rules,
			"no-console": "error",
			"import/no-default-export": "error",
			"@typescript-eslint/only-throw-error": "off",
			"@typescript-eslint/no-restricted-types": [
				"error",
				{
					types: {
						"React.FC": {
							message: "Use a type alias or interface instead."
						}
					}
				}
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: "TSEnumDeclaration",
					message: "Enums are not allowed. Use a union or object constants instead."
				}
			],
			"@typescript-eslint/no-misused-promises": [
				"error",
				{
					checksVoidReturn: {
						attributes: false
					}
				}
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					args: "all",
					argsIgnorePattern: "^_",
					caughtErrors: "all",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					ignoreRestSiblings: true
				}
			]
		}
	},
	{
		files: ["app/ssr.tsx", "app/api.ts", "app/types/*.ts"],
		rules: {
			"import/no-default-export": "off"
		}
	}
)

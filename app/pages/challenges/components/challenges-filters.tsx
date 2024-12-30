import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/shared/ui/select"

import { useChallengesFilters } from "../hooks/use-challenges-filters"

export const ChallengesFilters = () => {
	const [{ score, search, difficulty }, setFilters] = useChallengesFilters()

	return (
		<div className="flex flex-wrap items-center gap-4">
			<Input
				className="w-full md:max-w-64"
				placeholder="Buscar desafio"
				value={search}
				onChange={(e) => setFilters({ search: e.target.value })}
			/>

			<Select
				defaultValue={difficulty}
				onValueChange={(value) => setFilters({ difficulty: value })}>
				<SelectTrigger className="w-full sm:flex-1 md:min-w-[200px] md:flex-grow-0">
					<SelectValue placeholder="Dificuldade" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="easy">Fácil</SelectItem>
					<SelectItem value="medium">Médio</SelectItem>
					<SelectItem value="hard">Difícil</SelectItem>
					<SelectItem value="expert">Expert</SelectItem>
					<SelectItem value="all">Todos</SelectItem>
				</SelectContent>
			</Select>

			<Select
				defaultValue={score}
				onValueChange={(value) => setFilters({ score: value })}>
				<SelectTrigger className="w-full sm:flex-1 md:min-w-[200px] md:flex-grow-0">
					<SelectValue placeholder="Ordenar por" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="highest-score">Maior pontuação</SelectItem>
					<SelectItem value="lowest-score">Menor pontuação</SelectItem>
				</SelectContent>
			</Select>

			<Button
				className="w-full sm:w-auto"
				onClick={() => setFilters({ search: "", difficulty: "all", score: "all" })}>
				Limpar filtros
			</Button>
		</div>
	)
}

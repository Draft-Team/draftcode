export class LevelSystem {
	private baseExperience: number
	private multiplier: number

	constructor(baseExperience = 100, multiplier = 1.2) {
		if (baseExperience <= 0 || multiplier <= 0) {
			throw new Error("Base experience and multiplier must be greater than 0.")
		}

		this.baseExperience = baseExperience
		this.multiplier = multiplier
	}

	calculateTotalExperienceForLevel(level: number): number {
		let totalExperience = 0
		for (let i = 1; i <= level; i++) {
			totalExperience += Math.floor(this.baseExperience * i ** this.multiplier)
		}

		return totalExperience
	}

	calculateCurrentLevel(totalExperience: number): number {
		if (totalExperience < 0) {
			throw new Error("Total experience cannot be negative.")
		}

		let level = 1
		while (totalExperience >= this.calculateTotalExperienceForLevel(level)) {
			level++
		}

		return level - 1
	}

	calculateExperienceToNextLevel(totalExperience: number): number {
		if (totalExperience < 0) {
			throw new Error("Total experience cannot be negative.")
		}

		const currentLevel = this.calculateCurrentLevel(totalExperience)
		const experienceForNextLevel = this.calculateTotalExperienceForLevel(currentLevel + 1)

		return experienceForNextLevel - totalExperience
	}
}

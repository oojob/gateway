class AppCurrency {
	private primary: number
	private secondary: number

	constructor(primary: number, secondary: number) {
		if (!Number.isSafeInteger(primary)) {
			throw new Error('Cannot safely represent amount')
		}

		if (!Number.isSafeInteger(secondary)) {
			throw new Error('Cannot safely represent amount')
		}

		this.primary = primary
		this.secondary = primary
	}

	getPrimary = (): number => {
		return this.primary
	}

	getSecondary = (): number => {
		return this.secondary
	}
}

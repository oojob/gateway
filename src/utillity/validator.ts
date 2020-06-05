class Validation {
	private error = ''

	constructor() {
		this.error = ''
	}

	isRequired = (value: any, message: string) => {
		if (!value || value.length <= 0) {
			this.error = message
		}
	}

	hasMinLen = (value: any, min: number, message: string) => {
		if (!value || value.length < min) {
			this.error = message
		}
	}

	hasMaxLen = (value: any, max: number, message: string) => {
		if (!value || value.length > max) {
			this.error = message
		}
	}

	errors = () => this.error

	clear = () => {
		this.error = ''
	}

	isValid = () => this.error.length == 0
}

// ValidationContract.prototype.isFixedLen = (value, len, message) => {
// 	if (value.length != len) error = message
// }

// ValidationContract.prototype.isEmail = (value, message) => {
// 	var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
// 	if (!reg.test(value)) error = message
// }

// ValidationContract.prototype.isAccountNumber = (value, message) => {
// 	var reg = new RegExp(/^[0-9]{7,14}$/)
// 	if (!reg.test(value)) error = message
// }

// ValidationContract.prototype.isTaxInformation = (value, message) => {
// 	var taxArr = ['Tax0', 'Tax1', 'Tax2', 'Tax3']
// 	if (!taxArr.includes(value)) error = message
// }

export default Validation

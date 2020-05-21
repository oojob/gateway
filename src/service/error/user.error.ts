export const IsUserError = Symbol('IsUserError')

class UserError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'Error'
		this.message = message
		this[IsUserError] = true
		Error.captureStackTrace(this)
	}
}

export default UserError

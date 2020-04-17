import { createCipher, createDecipher } from 'crypto'
import { Application } from 'express'

class AppCrypto {
	public app: Application
	private ENCRYPT_ALGORITHM: string
	private ENCRYPT_SECRET: string

	constructor(app: Application) {
		const { ENCRYPT_SECRET = 'dododuck@N9', ENCRYPT_ALGORITHM = 'aes-256-ctr' } = process.env

		this.app = app
		this.ENCRYPT_ALGORITHM = ENCRYPT_ALGORITHM
		this.ENCRYPT_SECRET = ENCRYPT_SECRET
	}

	public encrypt = (text: string) => {
		this.app.logger.info(`Encrypt for ${text}`)

		try {
			const cipher = createCipher(this.ENCRYPT_ALGORITHM, this.ENCRYPT_SECRET)
			let crypted = cipher.update(text, 'utf8', 'hex')
			crypted += cipher.final('hex')

			return crypted
		} catch (error) {
			this.app.logger.error(error.message)

			return ''
		}
	}

	public decrypt = (text: string) => {
		this.app.logger.info(`Decrypt for ${text}`)

		try {
			const decipher = createDecipher(this.ENCRYPT_ALGORITHM, this.ENCRYPT_SECRET)
			let dec = decipher.update(text, 'hex', 'utf8')
			dec += decipher.final('utf8')

			return dec
		} catch (error) {
			this.app.logger.error(error.message)

			return ''
		}
	}
}

export default AppCrypto

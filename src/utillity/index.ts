import AppCrypto from './crypto'
import AppSlugify from './slugify'
import { Application } from 'express'
import { IAppUtils } from './util.interface'

class AppUtils implements IAppUtils {
	public app: Application

	constructor(app: Application) {
		this.app = app

		// this.app.logger.info('Initialized AppUtils')
	}

	public applyUtils = async (): Promise<boolean> => {
		const { encrypt, decrypt } = new AppCrypto(this.app)
		const { slugify } = new AppSlugify(this.app)
		this.app.utility = {
			encrypt,
			decrypt,
			slugify
		}

		return true
	}
}

export default AppUtils

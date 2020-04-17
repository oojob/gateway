import * as express from 'express'

import AppUtils from './utillity'
import { Application } from 'express'
import middlewaes from './middlewares'

class App {
	public app: Application
	public appUtils: AppUtils

	constructor() {
		this.app = express()

		this.appUtils = new AppUtils(this.app)
		this.applyServer()
	}

	public static bootstrap(): App {
		return new App()
	}

	private applyServer = async () => {
		await this.appUtils.applyUtils()
		await this.applyMiddleware()
	}

	private applyMiddleware = async () => {
		middlewaes(this.app)
	}
}

export const application = new App()
export default application.app

import { Application } from 'express'

export interface IAppUtils {
	app: Application
	applyUtils: () => void
}

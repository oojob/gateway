import * as bodyParser from 'body-parser'
import * as compression from 'compression'

import { Application, NextFunction, Request, Response } from 'express'

import cors from 'middlewares/cors'
import csrf from 'middlewares/csrf'
import errorHandler from 'middlewares/error-handler'
import logger from 'middlewares/logger'
import security from 'middlewares/security'
import toobusy from 'middlewares/toobusy'
import winston from 'middlewares/winston'

const { ENABLE_CSP = true, ENABLE_NONCE = true } = process.env

const middlewares = (app: Application) => {
	// CORS for crosss-te access
	app.use(cors())

	// json encoding and decoding
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	// set GZip on headers for request/response
	app.use(compression())

	// attach logger for application
	app.use((req: Request, res: Response, next: NextFunction) => {
		req.logger = winston

		return next()
	})

	app.use(logger)
	app.use(csrf)
	app.use(errorHandler)
	security(app, { enableCSP: Boolean(ENABLE_CSP), enableNonce: Boolean(ENABLE_NONCE) })

	// bussy server (wait for it to resolve)
	app.use(toobusy())
}

export default middlewares

import * as bodyParser from 'body-parser'
import * as compression from 'compression'

import { Application } from 'express'
import cors from 'middlewares/cors'
import csrf from 'middlewares/csrf'
import errorHandler from 'middlewares/error-handler'
import security from 'middlewares/security'
import toobusy from 'middlewares/toobusy'

const { ENABLE_CSP = true, ENABLE_NONCE = true } = process.env

const middlewares = (app: Application) => {
	// CORS for crosss-te access
	app.use(cors())

	// json encoding and decoding
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	// set GZip on headers for request/response
	app.use(compression())

	app.use(csrf)
	app.use(errorHandler)
	security(app, { enableCSP: Boolean(ENABLE_CSP), enableNonce: Boolean(ENABLE_NONCE) })

	// bussy server (wait for it to resolve)
	app.use(toobusy())
}

export default middlewares

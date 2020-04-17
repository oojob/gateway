import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as helmet from 'helmet'
import * as hpp from 'hpp'

import { Application, NextFunction, Request, Response } from 'express'

import cors from './cors'
import logger from './logger'
import toobusy from './toobusy'
import winston from './winston'

const middlewares = (app: Application) => {
	// CORS for crosss-te access
	app.use(cors())

	// json encoding and decoding
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())

	// set trusted ip
	app.set('trust proxy', true)

	// do not show powered by express
	app.set('x-powered-by', false)

	// set GZip on headers for request/response
	app.use(compression())

	// attach logger for application
	app.use((req: Request, _: Response, next: NextFunction) => {
		logger(winston)
		req.logger = winston

		return next()
	})

	// security helmet package
	// Don't expose any software information to hackers.
	app.disable('x-powered-by')

	// Express middleware to protect against HTTP Parameter Pollution attacks
	app.use(hpp())

	// The X-Frame-Options header tells browsers to prevent your webpage from being put in an iframe.
	app.use(helmet.frameguard({ action: 'sameorigin' }))

	// Cross-site scripting, abbreviated to “XSS”, is a way attackers can take over webpages.
	app.use(helmet.xssFilter())

	// Sets the X-Download-Options to prevent Internet Explorer from executing
	// downloads in your site’s context.
	// @see https://helmetjs.github.io/docs/ienoopen/
	app.use(helmet.ieNoOpen())

	// Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
	// to guess (“sniff”) the MIME type, which can have security implications. It
	// does this by setting the X-Content-Type-Options header to nosniff.
	// @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
	app.use(helmet.noSniff())

	// bussy server (wait for it to resolve)
	// app.use(toobusy())
}

export default middlewares

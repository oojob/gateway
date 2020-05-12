import * as morgan from 'morgan'

import { Request, Response } from 'express'

import _debug from 'debug'

const debug = _debug('middlewares:logging')

const { NODE_ENV = 'development', FORCE_DEV = false } = process.env
const isProduction = NODE_ENV === 'production' && !FORCE_DEV

const logger = morgan('combined', {
	skip: (_: Request, res: Response) => isProduction && res.statusCode >= 200 && res.statusCode < 300,
	stream: {
		write: (message: string) => debug(message)
	}
})

export default logger

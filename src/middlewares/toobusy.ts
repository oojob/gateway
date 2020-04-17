import * as toobusy from 'toobusy-js'
import { NextFunction, Request, Response } from 'express'

const isDevelopment = process.env.NODE_ENV === 'development'

export default () => (req: Request, res: Response, next: NextFunction) => {
	if (!isDevelopment && toobusy()) {
		res.statusCode = 503
		res.send('It looke like the sever is bussy. Wait few seconds...')
	} else {
		// queue up the request and wait for it to complete in testing and development phase
		next()
	}
}

import { NextFunction, Request, Response } from 'express'

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	if (err) {
		console.error(err)
		res.status(500).send('Oops, something went wrong! Our engineers have been alerted and will fix this asap.')
		// capture error with error metrics collector
	} else {
		return next()
	}
}

export default errorHandler

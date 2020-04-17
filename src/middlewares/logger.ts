import * as morgan from 'morgan'
import { Request, Response } from 'express'
import { Logger } from 'winston'

const logger = (logger: Logger) =>
	morgan('combined', {
		skip: (_: Request, res: Response) => res.statusCode >= 200 && res.statusCode < 300,
		stream: {
			write: (message: string, meta?: any) => logger.info(message, meta)
		}
	})

export default logger

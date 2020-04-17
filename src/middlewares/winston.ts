import { Logger, LoggerOptions, createLogger, format, transports } from 'winston'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const { combine, timestamp, prettyPrint } = format
const logDirectory = join(__dirname, 'log')
const isDevelopment = process.env.NODE_ENV === 'development'
type ILoggerOptions = { file: LoggerOptions; console: LoggerOptions }

export const loggerOptions = {
	file: {
		level: 'info',
		filename: `${logDirectory}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false
	},
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false,
		colorize: true
	}
}
const loggerTransports = [
	new transports.Console({
		...loggerOptions.console,
		format: format.combine(
			format.timestamp(),
			format.colorize({ all: true }),
			format.align(),
			format.printf((info) => {
				const { timestamp, level, message, ...args } = info

				// const ts = timestamp.slice(0, 19).replace('T', ' ');
				return `${timestamp} ${level}: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`
			})
		)
	})
]

class AppLogger {
	public logger: Logger
	public loggerOptions: ILoggerOptions

	constructor(options: ILoggerOptions) {
		if (!isDevelopment) {
			existsSync(logDirectory) || mkdirSync(logDirectory)
		}

		this.logger = createLogger({
			transports: isDevelopment
				? [...loggerTransports]
				: [
						...loggerTransports,
						new transports.File({
							...options.file,
							format: combine(timestamp(), prettyPrint())
						})
				  ],
			exitOnError: false
		})
	}
}

const { logger } = new AppLogger(loggerOptions)
export default logger

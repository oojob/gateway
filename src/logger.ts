import { Logger, LoggerOptions, createLogger, format, transports } from 'winston'
import { basename, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const { combine, timestamp, prettyPrint } = format
const logDirectory = join(__dirname, 'log')
const isDevelopment = process.env.NODE_ENV === 'development'
type ILoggerOptions = { file: LoggerOptions; console: LoggerOptions }

const { FILE_LOG_LEVEL, CONSOLE_LOG_LEVEL } = process.env
export const loggerOptions = {
	file: {
		level: FILE_LOG_LEVEL || 'info',
		filename: `${logDirectory}/logs/app.log`,
		handleExceptions: true,
		json: true,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false
	},
	console: {
		level: CONSOLE_LOG_LEVEL || 'debug',
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
				const { level, message, label } = info
				// ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}

				return `${level} [${label}]: ${message}`
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
			format: format.combine(
				format.label({ label: basename(process.mainModule ? process.mainModule.filename : 'unknown.file') }),
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
			),
			transports: isDevelopment
				? [...loggerTransports]
				: [
						...loggerTransports,
						new transports.File({
							...options.file,
							format: combine(
								format.printf((info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`)
							)
						})
				  ],
			exitOnError: false
		})
	}
}

const { logger } = new AppLogger(loggerOptions)
export default logger

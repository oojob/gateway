import { Logger } from 'winston'

interface GatewayUtils {
	encrypt: (value: string) => string
	decrypt: (value: string) => string
	slugify: (value: string) => string
}

declare module 'express-serve-static-core' {
	interface Request {
		logger: Logger
	}

	interface Application {
		logger: Logger
		utility: GatewayUtils
	}
}

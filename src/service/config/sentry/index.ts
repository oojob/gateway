import * as Sentry from '@sentry/node'

import { RewriteFrames } from '@sentry/integrations'

global.__rootdir__ = __dirname || process.cwd()
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [
		new RewriteFrames({
			root: global.__rootdir__
		})
	],
	serverName: process.env.SENTRY_NAME
})

export default Sentry

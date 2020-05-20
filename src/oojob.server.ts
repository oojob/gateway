import { Server, createServer } from 'http'

import App from 'app.server'
import { Application } from 'express'
import graphqlServer from 'graphql.server'
import logger from 'logger'
import { normalizePort } from 'utillity/normalize'

class OojobServer {
	public app: Application
	public server: Server

	constructor(app: Application) {
		this.app = app
		graphqlServer.applyMiddleware({
			app,
			onHealthCheck: () =>
				new Promise((resolve, reject) => {
					// Replace the `true` in this conditional with more specific checks!
					if (parseInt('2') === 2) {
						resolve()
					} else {
						reject()
					}
				})
		})
		this.server = createServer(app)
		graphqlServer.installSubscriptionHandlers(this.server)
	}

	startSyncServer = async (port: string) => {
		try {
			const PORT = normalizePort(port)
			this.server.listen(PORT, () => {
				logger.info(`server ready at http://localhost:${PORT}${graphqlServer.graphqlPath}`)
				logger.info(`Subscriptions ready at ws://localhost:${PORT}${graphqlServer.subscriptionsPath}`)
				logger.info(`Try your health check at: http://localhost:${PORT}/.well-known/apollo/server-health`)
			})
		} catch (error) {
			await this.stopServer()
		}
	}

	stopServer = async () => {
		process.on('SIGINT', async () => {
			logger.info('Closing oojob SyncServer ...')

			try {
				this.server.close()
				logger.info('oojob SyncServer Closed')
			} catch (error) {
				console.error('Error Closing SyncServer Server Connection')
				console.error(error)
				process.kill(process.pid)
			}
		})
	}
}

export const { startSyncServer, stopServer, server, app } = new OojobServer(App)

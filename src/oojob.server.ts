import { Server, createServer } from 'http'

import App from 'app.server'
import { Application } from 'express'
import graphqlServer from 'graphql.server'
import { normalizePort } from 'utillity/normalize'

class OojobServer {
	public app: Application
	public server: Server

	constructor(app: Application) {
		this.app = app
		graphqlServer.applyMiddleware({ app })
		this.server = createServer(app)
		graphqlServer.installSubscriptionHandlers(this.server)
	}

	startSyncServer = async (port: string) => {
		try {
			const PORT = normalizePort(port)
			this.server.listen(PORT, () => {
				console.log(`server ready at http://localhost:${PORT}${graphqlServer.graphqlPath}`)
				console.log(`Subscriptions ready at ws://localhost:${PORT}${graphqlServer.subscriptionsPath}`)
			})
		} catch (error) {
			await this.stopServer()
		}
	}

	stopServer = async () => {
		process.on('SIGINT', async () => {
			console.log('Closing oojob SyncServer ...')

			try {
				this.server.close()
				console.log('oojob SyncServer Closed')
			} catch (error) {
				console.error('Error Closing SyncServer Server Connection')
				console.error(error)
				process.kill(process.pid)
			}
		})
	}
}

export const { startSyncServer, stopServer, server, app } = new OojobServer(App)

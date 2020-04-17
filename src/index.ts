import 'dotenv/config'

import { Server, createServer } from 'http'
import { fork, isMaster, on } from 'cluster'

import App from './app'
import { Application } from 'express'
import graphqlServer from './graphql'
import { normalizePort } from './utillity/normalize'

declare const module: any

class SyncServer {
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
			console.log('Closing Stayology SyncServer ...')

			try {
				this.server.close()
				console.log('Stayology SyncServer Closed')
			} catch (error) {
				console.error('Error Closing SyncServer Server Connection')
				console.error(error)
				process.kill(process.pid)
			}
		})
	}
}

const { startSyncServer, stopServer, app, server } = new SyncServer(App)
const start = async () => {
	const { PORT } = process.env
	const port = PORT || '8080'

	try {
		await stopServer()
		await startSyncServer(port)
	} catch (error) {
		console.error('Server Failed to start')
		console.error(error)
		process.exit(1)
	}
}

if (isMaster) {
	const numCPUs = require('os').cpus().length

	console.log(`Master ${process.pid} is running`)

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		fork()
	}

	on('fork', (worker) => {
		console.log('worker is dead:', worker.isDead())
	})

	on('exit', (worker) => {
		console.log('worker is dead:', worker.isDead())
	})
} else {
	/**
	 * [if Hot Module for webpack]
	 * @param  {[type]} module [global module node object]
	 */
	let currentApp = app
	if (module.hot) {
		module.hot.accept('./app', () => {
			server.removeListener('request', currentApp)
			server.on('request', app)
			currentApp = app
		})

		/**
		 * Next callback is essential:
		 * After code changes were accepted we need to restart the app.
		 * server.close() is here Express.JS-specific and can differ in other frameworks.
		 * The idea is that you should shut down your app here.
		 * Data/state saving between shutdown and new start is possible
		 */
		module.hot.dispose(() => server.close())
	}

	// Workers can share any TCP connection
	// In this case it is an HTTP server
	start()

	console.log(`Worker ${process.pid} started`)
}

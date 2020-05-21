import 'dotenv/config'

import { app, server, startSyncServer, stopServer } from 'oojob.server'
import { fork, isMaster, on } from 'cluster'

import logger from 'logger'
import tracer from 'tracer'

declare const module: any

export const appTracer = tracer('service:gateway')
export const span = appTracer.startSpan('grpc:service')

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

	logger.info(`Master ${process.pid} is running`)

	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		fork()
	}

	on('fork', (worker) => {
		logger.info('worker is dead:', worker.isDead())
	})

	on('exit', (worker) => {
		logger.info('worker is dead:', worker.isDead())
	})
} else {
	/**
	 * [if Hot Module for webpack]
	 * @param  {[type]} module [global module node object]
	 */
	let currentApp = app
	if (module.hot) {
		module.hot.accept('oojob.server', () => {
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

	logger.info(`Worker ${process.pid} started`)
}

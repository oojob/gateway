import { GraphQLError } from 'graphql'
import { IsUserError } from 'service/error/user.error'
import { RateLimitError } from 'graphql-rate-limit'
import { Request } from 'express'
import Sentry from 'service/config/sentry'
import logger from 'logger'

const queryRe = /\s*(query|mutation)[^{]*/

const collectQueries = (query: string) => {
	if (!query) return 'No query'

	return query
		.split('\n')
		.map((line) => {
			const m = line.match(queryRe)

			return m ? m[0].trim() : ''
		})
		.filter((line) => !!line)
		.join('\n')
}

const errorPath = (error: any) => {
	if (!error.path) return ''

	return error.path
		.map((value: any, index: number) => {
			if (!index) return value

			return typeof value === 'number' ? `[${value}]` : `.${value}`
		})
		.join('')
}

const logGraphQLError = (error: any, req?: Request) => {
	logger.info('---GraphQL Error---')
	logger.error(error)
	error &&
		error.extensions &&
		error.extensions.exception &&
		logger.error(error.extensions.exception.stacktrace.join('\n'))

	if (req) {
		logger.info(collectQueries(req.body.query))
		logger.info('variables', JSON.stringify(req.body.variables || {}))
	}
	const path = errorPath(error)
	path && logger.info('path', path)
	logger.info('-------------------\n')
}

const createGraphQLErrorFormatter = (req?: Request) => (error: GraphQLError) => {
	logGraphQLError(error, req)

	const err = error.originalError || error
	const isUserError = err[IsUserError] || err instanceof RateLimitError

	let sentryId = 'ID only generated in production'
	if (!isUserError || err instanceof RateLimitError) {
		if (process.env.NODE_ENV === 'production') {
			sentryId = Sentry.captureException(error)
		}
	}

	return {
		message: isUserError ? error.message : `Internal server error: ${sentryId}`,
		// Hide the stack trace in production mode
		stack: !(process.env.NODE_ENV === 'production')
	}
}

export default createGraphQLErrorFormatter

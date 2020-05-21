import * as applicantsSchema from 'client/root/schema/oojob/applicants.graphql'
import * as companySchema from 'client/company/schema/schema.graphql'
import * as cursorSchema from 'client/root/schema/oojob/cursor.graphql'
import * as depthLimit from 'graphql-depth-limit'
import * as jobSchema from 'client/job/schema/schema.graphql'
import * as metadataSchema from 'client/root/schema/oojob/metadata.graphql'
import * as permissionsSchema from 'client/root/schema/oojob/permissions.graphql'
import * as placeSchema from 'client/root/schema/oojob/place.graphql'
import * as profileSchema from 'client/profile/schema/schema.graphql'
import * as rootSchema from 'client/root/schema/schema.graphql'
import * as systemSchema from 'client/root/schema/oojob/system.graphql'
import * as timeSchema from 'client/root/schema/oojob/time.graphql'

import { ApolloServer, PubSub } from 'apollo-server-express'
import profileResolvers, { extractTokenMetadata } from 'client/profile/resolver'

import { AccessDetailsResponse } from 'generated/graphql'
import { RedisCache } from 'apollo-server-cache-redis'
import { Request } from 'express'
import { config } from 'service/config/redis'
import createGraphQLErrorFormatter from 'service/error/graphql.error'
import logger from 'logger'
import { merge } from 'lodash'
import rootResolvers from 'client/root/resolver'
import tracer from 'tracer'
import winston from 'winston'

export const pubsub = new PubSub()
export const typeDefs = [
	rootSchema,
	applicantsSchema,
	cursorSchema,
	metadataSchema,
	placeSchema,
	systemSchema,
	permissionsSchema,
	timeSchema,
	profileSchema,
	companySchema,
	jobSchema
]
export const resolvers = merge({}, rootResolvers, profileResolvers)
export interface OoJobContext {
	req: Request
	pubsub: PubSub
	tracer: typeof tracer
	token: string
	accessDetails: AccessDetailsResponse
	logger: winston.Logger
}
const server = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: createGraphQLErrorFormatter(),
	context: async ({ req, connection }) => {
		const tokenData = req.headers.authorization
		let token: string | undefined = undefined
		let accessDetails: AccessDetailsResponse | undefined = undefined

		if (tokenData) {
			token = tokenData.split(' ')[1]
		}
		if (token) {
			accessDetails = await extractTokenMetadata(token)
		}

		return {
			req,
			connection,
			pubsub,
			tracer,
			accessDetails,
			token,
			logger
		}
	},
	tracing: true,
	introspection: process.env.NODE_ENV !== 'production',
	engine: false,
	validationRules: [depthLimit(10)],
	cacheControl: {
		calculateHttpHeaders: false,
		// Cache everything for at least a minute since we only cache public responses
		defaultMaxAge: 60
	},
	cache: new RedisCache({
		...config,
		keyPrefix: 'apollo-cache:'
	})
})

export default server

import * as companySchema from './client/company/schema/schema.graphql'
import * as jobSchema from './client/job/schema/schema.graphql'
import * as rootSchema from './client/root/schema/schema.graphql'

import { ApolloServer, PubSub } from 'apollo-server-express'

import companyResolvers from './client/company/resolver'
import jobResolvers from './client/job/resolver'
import { merge } from 'lodash'
import rootResolvers from './client/root/resolver'

export const pubsub = new PubSub()
export const typeDefs = [rootSchema, companySchema, jobSchema]
export const resolvers = merge({}, rootResolvers, companyResolvers, jobResolvers)

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req, connection }) => ({
		req,
		connection,
		pubsub
	}),
	tracing: true
})

export default server

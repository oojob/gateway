import * as companySchema from './client/company/schema/schema.graphql'
import * as rootSchema from './client/root/schema/schema.graphql'

import { ApolloServer, PubSub } from 'apollo-server-express'

import companyResolvers from './client/company/resolver'
import { merge } from 'lodash'
import rootResolvers from './client/root/resolver'

export const pubsub = new PubSub()
export const typeDefs = [rootSchema, companySchema]
export const resolvers = merge({}, rootResolvers, companyResolvers)

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req, connection }) => {
		return {
			req,
			connection,
			pubsub
		}
	},
	tracing: true
})

export default server

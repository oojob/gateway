import { MutationResolvers, QueryResolvers, Resolvers, SubscriptionResolvers } from 'generated/graphql'

const Query: QueryResolvers = {
	dummy: () => 'dodo duck lives here'
}
const Mutation: MutationResolvers = {
	dummy: () => 'Dodo Duck'
}
const Subscription: SubscriptionResolvers = {
	dummy: (_, __, { pubsub }) => pubsub.asyncIterator('DODO_DUCK')
}

const rootResolvers: Resolvers = {
	Query,
	Mutation,
	Subscription,
	Result: {
		__resolveType: (node: any) => {
			if (node.noOfEmployees) return 'Company'

			return 'Job'
		}
	},
	INode: {
		__resolveType: (node: any) => {
			if (node.noOfEmployees) return 'Company'
			// if (node.stars) return 'Review'

			return 'Company'
		}
	}
}

export default rootResolvers

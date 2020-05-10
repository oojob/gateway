import { PubSub } from 'apollo-server-express'

const Mutation = {
	dummy: () => 'Dodo Duck'
}
const Query = {
	dummy: () => 'dodo duck lives here'
}
const Subscription = {
	dummy: (_: any, __: any, { pubsub }: { pubsub: PubSub }) => pubsub.asyncIterator('DODO_DUCK')
}

const rootResolvers = {
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
	// AggregateRating: undefined,
	// Applicant: undefined,
	// Attachment: undefined,
	// Company: undefined,
	// Date: undefined,
	// Edge: undefined,
	// Education: undefined,
	// Email: undefined,
	// GeoLocation: undefined,
	// Id: undefined,
	// Identifier: undefined,
	// PageInfo: undefined,
	// Job: undefined,
	// JobResultCursor: undefined,
	// Metadata: undefined,
	// Pagination: undefined,
	// Place: undefined,
	// Profile: undefined,
	// ProfileSecurity: undefined,
	// Range: undefined,
	// Rating: undefined,
	// Upload: undefined,
	// Time: undefined,
	// Timestamp: undefined,
	// Sallary: undefined,
	// Review: undefined
}

export default rootResolvers

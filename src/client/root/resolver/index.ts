const rootResolvers = {
	Query: {
		dummy: () => 'dodo duck lives here'
	},
	Mutation: {
		dummy: async () => {
			return 'Dodo Duck'
		}
	},
	Result: {
		__resolveType: (node: any) => {
			if (node.noOfEmployees) return 'Company'

			return 'Job'
		}
	},
	INode: {
		__resolveType: (node: any) => {
			if (node.noOfEmployees) return 'Company'
			if (node.stars) return 'Review'

			return 'Company'
		}
	}
}

export default rootResolvers

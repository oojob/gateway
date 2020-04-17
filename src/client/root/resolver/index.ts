const rootResolvers = {
	Query: {
		dummy: () => 'dodo duck lives here'
	},
	Mutation: {
		dummy: async () => {
			return 'Dodo Duck'
		}
	}
}

export default rootResolvers

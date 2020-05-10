import { Identifier } from '@oojob/oojob-protobuf'
import { Profile } from '@oojob/protorepo-profile-node/service_pb'
import { createProfile } from '../../profile/transformer'

const rootResolvers = {
	Query: {
		dummy: async () => {
			// do for dodo
			try {
				const profile = new Profile()
				const identifier = new Identifier()
				identifier.setName('dodo duck')
				identifier.setIdentifier('UTF1234:)(()')
				identifier.setAlternateName('dodo duck alternate name')
				profile.setIdentity(identifier)

				const res = await createProfile(profile)
				console.log(res)
			} catch (error) {
				console.log(error)
			}

			return 'dodo duck lives here'
		}
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

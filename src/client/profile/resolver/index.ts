// import { Email, Identifier } from '@oojob/oojob-protobuf'
// import { Id as IdSchema, MutationResolvers } from 'generated/graphql'
// import { Profile, ProfileSecurity } from '@oojob/protorepo-profile-node/service_pb'

// import { createProfile } from 'client/profile/transformer'

// export const Mutation = {
// 	CreateProfile: async (_, { input }) => {
// 		// try {
// 		// 	const middleName = input.middleName ? ` ${input.middleName.trim()}` : ''
// 		// 	const familyName = input.familyName ? ` ${input.familyName.trim()}` : ''
// 		// 	const name = `${input.givenName}${middleName}${familyName}`
// 		// 	const identifier = new Identifier()
// 		// 	identifier.setName(name.trim())
// 		// 	const profileSecurity = new ProfileSecurity()
// 		// 	if (input.security?.password) {
// 		// 		profileSecurity.setPassword(input.security.password)
// 		// 	}
// 		// 	const email = new Email()
// 		// 	if (input.email?.email) {
// 		// 		email.setEmail(input.email.email)
// 		// 	}
// 		// 	if (input.email?.show) {
// 		// 		email.setShow(input.email.show)
// 		// 	}
// 		// 	const profile = new Profile()
// 		// 	if (input?.gender) {
// 		// 		profile.setGender(input.gender)
// 		// 	}
// 		// 	profile.setEmail(email)
// 		// 	profile.setIdentity(identifier)
// 		// 	profile.setSecurity(profileSecurity)
// 		// 	await createProfile(profile)
// 		// } catch (error) {
// 		// 	console.log(error)
// 		// }
// 		const profileResponse: IdSchema = {
// 			id: '123'
// 		}

// 		return profileResponse
// 	}
// }

// export const profileResolvers = {
// 	Mutation
// }
// export default profileResolvers

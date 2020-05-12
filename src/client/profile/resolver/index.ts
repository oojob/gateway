import { DefaultResponse, Email, Id, Identifier } from '@oojob/oojob-protobuf'
import {
	DefaultResponse as DefaultResponseSchema,
	Id as IdSchema,
	MutationResolvers,
	QueryResolvers
} from 'generated/graphql'
import {
	Profile,
	ProfileSecurity,
	ValidateEmailRequest,
	ValidateUsernameRequest
} from '@oojob/protorepo-profile-node/service_pb'
import { createProfile, validateEmail, validateUsername } from 'client/profile/transformer'

export const Query: QueryResolvers = {
	ValidateUsername: async (_, { input }) => {
		const username = input.username
		const validateUsernameReq = new ValidateUsernameRequest()
		if (username) {
			validateUsernameReq.setUsername(username)
		}

		const res: DefaultResponseSchema = {}
		try {
			const validateRes = (await validateUsername(validateUsernameReq)) as DefaultResponse
			res.status = validateRes.getStatus()
			res.code = validateRes.getCode()
			res.error = validateRes.getError()
		} catch ({ message, code }) {
			res.status = false
			res.error = message
			res.code = code
		}

		return res
	},
	ValidateEmail: async (_, { input }) => {
		const email = input.email
		const validateEmailReq = new ValidateEmailRequest()
		if (email) {
			validateEmailReq.setEmail(email)
		}

		const res: DefaultResponseSchema = {}
		try {
			const validateRes = (await validateEmail(validateEmailReq)) as DefaultResponse
			res.status = validateRes.getStatus()
			res.code = validateRes.getCode()
			res.error = validateRes.getError()
		} catch ({ message, code }) {
			res.status = false
			res.error = message
			res.code = code
		}

		return res
	}
}

export const Mutation: MutationResolvers = {
	CreateProfile: async (_, { input }) => {
		const middleName = input.middleName ? ` ${input.middleName.trim()}` : ''
		const familyName = input.familyName ? ` ${input.familyName.trim()}` : ''
		const name = `${input.givenName}${middleName}${familyName}`
		const identifier = new Identifier()
		identifier.setName(name.trim())
		const profileSecurity = new ProfileSecurity()
		if (input.security?.password) {
			profileSecurity.setPassword(input.security.password)
		}
		const email = new Email()
		if (input.email?.email) {
			email.setEmail(input.email.email)
		}
		if (input.email?.show) {
			email.setShow(input.email.show)
		}
		const profile = new Profile()
		if (input?.gender) {
			profile.setGender(input.gender)
		}
		if (input?.username) {
			profile.setUsername(input.username)
		}
		profile.setEmail(email)
		profile.setIdentity(identifier)
		profile.setSecurity(profileSecurity)
		const res = (await createProfile(profile)) as Id

		const profileResponse: IdSchema = {
			id: res.getId()
		}

		return profileResponse
	}
}

export const profileResolvers = {
	Mutation,
	Query
}
export default profileResolvers

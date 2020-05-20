import {
	AccessDetails,
	AuthRequest,
	AuthResponse,
	Profile,
	ProfileSecurity,
	ReadProfileRequest,
	TokenRequest,
	ValidateEmailRequest,
	ValidateUsernameRequest
} from '@oojob/protorepo-profile-node/service_pb'
import {
	AccessDetailsResponse as AccessDetailsResponseSchema,
	AuthResponse as AuthResponseSchema,
	DefaultResponse as DefaultResponseSchema,
	Id as IdSchema,
	MutationResolvers,
	Profile as ProfileSchema,
	ProfileSecurity as ProfileSecuritySchema,
	QueryResolvers
} from 'generated/graphql'
import { DefaultResponse, Email, Id, Identifier } from '@oojob/oojob-protobuf'
import {
	auth,
	createProfile,
	logout,
	readProfile,
	refreshToken,
	validateEmail,
	validateUsername,
	verifyToken
} from 'client/profile/transformer'

import { AuthenticationError } from 'apollo-server-express'

export const extractTokenMetadata = async (token: string): Promise<AccessDetailsResponseSchema> => {
	const tokenRequest = new TokenRequest()

	tokenRequest.setToken(token)

	const res: AccessDetailsResponseSchema = {}
	try {
		const tokenRes = (await verifyToken(tokenRequest)) as AccessDetails
		res.verified = tokenRes.getVerified()
		res.accessUuid = tokenRes.getAccessUuid()
		res.accountType = tokenRes.getAccountType()
		res.authorized = tokenRes.getAuthorized()
		res.email = tokenRes.getEmail()
		res.identifier = tokenRes.getIdentifier()
		res.userId = tokenRes.getUserId()
		res.username = tokenRes.getUsername()
	} catch (error) {
		res.verified = false
		res.accessUuid = null
		res.accountType = null
		res.authorized = false
		res.email = null
		res.exp = null
		res.identifier = null
		res.userId = null
		res.username = null
	}

	return res
}

export const Query: QueryResolvers = {
	ValidateUsername: async (_, { input }, { tracer }) => {
		const span = tracer.startSpan('client:service-profile:validate-username')

		const res: DefaultResponseSchema = {}

		// tracer.withSpanAsync(span, async () => {
		const username = input.username
		const validateUsernameReq = new ValidateUsernameRequest()
		if (username) {
			validateUsernameReq.setUsername(username)
		}

		try {
			const validateRes = (await validateUsername(validateUsernameReq)) as DefaultResponse
			res.status = validateRes.getStatus()
			res.code = validateRes.getCode()
			res.error = validateRes.getError()
			span.end()
		} catch ({ message, code }) {
			res.status = false
			res.error = message
			res.code = code
			span.end()
		}
		// })

		return res
	},
	ValidateEmail: async (_, { input }) => {
		const validateEmailReq = new ValidateEmailRequest()

		const email = input.email
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
	},
	VerifyToken: async (_, { input }, { token: accessToken }) => {
		let res: AccessDetailsResponseSchema = {}

		const token = (input && input.token) || accessToken
		if (token) {
			res = await extractTokenMetadata(token)
		}

		return res
	},
	RefreshToken: async (_, { input }, { token: accessToken }) => {
		const res: AuthResponseSchema = {}

		const tokenRequest = new TokenRequest()
		const token = (input && input.token) || accessToken
		if (token) {
			tokenRequest.setToken(token)
		}

		try {
			const tokenResponse = (await refreshToken(tokenRequest)) as AuthResponse
			res.access_token = tokenResponse.getAccessToken()
			res.refresh_token = tokenResponse.getRefreshToken()
			res.valid = tokenResponse.getValid()
		} catch (error) {
			res.access_token = ''
			res.refresh_token = ''
			res.valid = false
		}

		return res
	},
	ReadProfile: async (_, { input }, { accessDetails }) => {
		if (!accessDetails) {
			throw new AuthenticationError('you must be logged in')
		}

		if (input.id !== accessDetails.userId) {
			throw new Error("you can't access other profile")
		}

		const res: ProfileSchema = {}
		const readProfileRequest = new ReadProfileRequest()
		readProfileRequest.setAccountId(input.id)

		try {
			const profileRes = (await readProfile(readProfileRequest)) as Profile
			const profileSecurity: ProfileSecuritySchema = {}

			const email = {
				email: profileRes.getEmail()?.getEmail(),
				// status: profileRes.getEmail()?.getStatus(),
				show: profileRes.getEmail()?.getShow()
			}

			profileSecurity.verified = profileRes.getSecurity()?.getVerified()

			res.username = profileRes.getUsername()
			res.givenName = profileRes.getGivenName()
			res.familyName = profileRes.getFamilyName()
			res.middleName = profileRes.getMiddleName()
			res.email = email
			res.security = profileSecurity
		} catch (error) {
			throw new Error(error)
		}

		return res
	}
}

export const Mutation: MutationResolvers = {
	Auth: async (_, { input }) => {
		const authRequest = new AuthRequest()
		if (input?.username) {
			authRequest.setUsername(input.username)
		}
		if (input?.password) {
			authRequest.setPassword(input.password)
		}

		const res: AuthResponseSchema = {}
		try {
			const tokenResponse = (await auth(authRequest)) as AuthResponse
			res.access_token = tokenResponse.getAccessToken()
			res.refresh_token = tokenResponse.getRefreshToken()
			res.valid = tokenResponse.getValid()
		} catch (error) {
			res.access_token = ''
			res.refresh_token = ''
			res.valid = false
		}

		return res
	},
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
	},
	Logout: async (_, { input }, { token: accessToken }) => {
		const res: DefaultResponseSchema = {}
		const tokenRequest = new TokenRequest()

		const token = (input && input.token) || accessToken
		if (token) {
			tokenRequest.setToken(token)
		}

		try {
			const logoutRes = (await logout(tokenRequest)) as DefaultResponse
			res.status = logoutRes.getStatus()
			res.code = logoutRes.getCode()
			res.error = logoutRes.getError()
		} catch ({ message, code }) {
			res.status = false
			res.error = message
			res.code = code
		}

		return res
	}
}

export const profileResolvers = {
	Mutation,
	Query
}
export default profileResolvers

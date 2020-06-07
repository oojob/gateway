import { DefaultResponse as DefaultResponseSchema, MutationResolvers } from 'generated/graphql'

import { AuthenticationError } from 'apollo-server-express'
import { DefaultResponse } from '@oojob/oojob-protobuf'
import { SendMailReq } from '@oojob/protorepo-mail-node/service_pb'
import { sendMail } from '../transformer'

export const Mutation: MutationResolvers = {
	SendMail: async (_, { input }, { logger, accessDetails }) => {
		logger.info('send mail')

		if (!accessDetails) {
			throw new AuthenticationError('you must be logged in')
		}

		const res: DefaultResponseSchema = {}
		const sendMailReq = new SendMailReq()
		if (input && input.from) {
			sendMailReq.setFrom(input.from)
		}
		if (input && input.to) {
			sendMailReq.setTo(input.to)
		}
		if (input && input.subject) {
			sendMailReq.setSubject(input.subject)
		}
		if (input && input.message) {
			sendMailReq.setMessage(input.message)
		}

		try {
			const mailRes = ((await sendMail(sendMailReq)) as unknown) as DefaultResponse
			res.status = mailRes.getStatus()
			res.code = mailRes.getCode()
			res.error = mailRes.getError()
		} catch ({ message, code }) {
			res.status = false
			res.error = message
			res.code = code
		}

		return res
	}
}

export const mailResolvers = {
	Mutation
}
export default mailResolvers

import * as grpc from 'grpc'

import { MailServiceClient } from '@oojob/protorepo-mail-node'

const { MAIL_SERVICE_URI = 'localhost:3001' } = process.env
const mailClient = new MailServiceClient(MAIL_SERVICE_URI, grpc.credentials.createInsecure())

export default mailClient

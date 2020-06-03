import { HealthCheckRequest, HealthCheckResponse } from '@oojob/protorepo-company-node/service_pb'
import { Mail, SendMailReq } from '@oojob/protorepo-mail-node/service_pb'

import { Id } from '@oojob/oojob-protobuf'
import mailClient from 'client/mail'
import { promisify } from 'util'

export const sendMail = promisify<SendMailReq>(mailClient.sendMail).bind(mailClient)
export const readMail = promisify<Id, Mail>(mailClient.readMail).bind(mailClient)
// export const getMailNotification = promisify(mailClient.getMailNotification).bind(mailClient)
// export const getMessageBox = promisify(mailClient.getMessageBox).bind(mailClient)
export const getChannel = promisify(mailClient.getChannel).bind(mailClient)
// export const getMailBox = promisify(mailClient.getMailBox).bind(mailClient)
export const check = promisify<HealthCheckRequest, HealthCheckResponse>(mailClient.check).bind(mailClient)
export const close = promisify(mailClient.close).bind(mailClient)

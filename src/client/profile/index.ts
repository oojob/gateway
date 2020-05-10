import * as grpc from 'grpc'

import { ProfileServiceClient } from '@oojob/protorepo-profile-node'

const { ACCOUNT_SERVICE_URI = 'localhost:3000' } = process.env
const profileClient = new ProfileServiceClient(ACCOUNT_SERVICE_URI, grpc.credentials.createInsecure())

export default profileClient

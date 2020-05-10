import * as grpc from 'grpc'

import { ProfileServiceClient } from '@oojob/protorepo-profile-node'

const profileClient = new ProfileServiceClient('localhost:3000', grpc.credentials.createInsecure())

export default profileClient

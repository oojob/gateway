import * as grpc from 'grpc'

import { CompanyServiceClient } from '@oojob/protorepo-company-node'

const companyClient = new CompanyServiceClient('localhost:3000', grpc.credentials.createInsecure())

export default companyClient

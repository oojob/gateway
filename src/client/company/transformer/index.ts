import companyClient from '../'
import { promisify } from 'util'

export const readCompany = promisify(companyClient.readCompany).bind(companyClient)
export const readCompanies = promisify(companyClient.readCompanies).bind(companyClient)
export const readAllCompanies = promisify(companyClient.readAllCompanies).bind(companyClient)
export const createCompany = promisify(companyClient.createCompany).bind(companyClient)
export const updateCompany = promisify(companyClient.updateCompany).bind(companyClient)
export const deleteCompany = promisify(companyClient.deleteCompany).bind(companyClient)

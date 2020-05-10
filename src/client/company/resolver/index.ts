import { Company, CompanyAllResponse, Id, Pagination, Range } from '@oojob/protorepo-company-node/service_pb'
import { createCompany, readAllCompanies, readCompany } from 'client/company/transformer'

import { PubSub } from 'apollo-server-express'

const COMPANY_CREATED = 'COMPANY_CREATED'

const ReadCompany = async (_: any, { input }: any) => {
	const id = new Id()
	id.setId(input)
	const company = (await readCompany(id)) as Company

	return company.toObject(true)
}

const ReadCompanies = async (_: any, { input }: any) => {
	const pagination = new Pagination()
	pagination.setLimit(input.limit)
	pagination.setSkip(input.skip)

	try {
		const response = (await readAllCompanies(pagination)) as CompanyAllResponse
		const _companies = response.getCompaniesList()
		const companies = _companies.map((company) => company.toObject(true))

		return companies
	} catch (error) {
		throw new Error(error)
	}
}

export const Query = {
	ReadCompany,
	ReadCompanies
}

const CreateCompany = async (_: any, { input }: any, { pubsub }: { pubsub: PubSub }) => {
	const companyInput = new Company()
	companyInput.setCreatedBy(input.createdBy)
	companyInput.setName(input.name)
	companyInput.setDescription(input.description)
	companyInput.setUrl(input.url)
	companyInput.setLogo(input.logo)
	companyInput.setLocation(input.location)
	companyInput.setFoundedYear(input.foundedYear)
	const range = new Range()
	range.setMin(input.noOfEmployees.min)
	range.setMax(input.noOfEmployees.max)
	companyInput.setNoOfEmployees(range)
	companyInput.setHiringStatus(input.hiringStatus)
	companyInput.setSkillsList(input.skills)

	try {
		const response = (await createCompany(companyInput)) as Id
		const company = response.toObject()
		pubsub.publish(COMPANY_CREATED, { companyCreated: company })

		return company
	} catch (error) {
		throw new Error(error)
	}
}
const UpdateCompany = () => {}

const DeleteCompany = () => {}

export const Mutation = {
	CreateCompany,
	UpdateCompany,
	DeleteCompany
}

const CompanyCreated = {
	subscribe: (_: any, __: any, { pubsub }: { pubsub: PubSub }) => pubsub.asyncIterator(COMPANY_CREATED)
}

export const Subscription = {
	CompanyCreated
}

export const companyResolvers = {
	Query,
	Mutation,
	Subscription
}
export default companyResolvers

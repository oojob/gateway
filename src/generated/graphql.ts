import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import { OoJobContext } from 'graphql.server'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
	{ [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
	Date: any
	/** The `Upload` scalar type represents a file upload. */
	Upload: any
}

export type AccessDetailsResponse = {
	__typename?: 'AccessDetailsResponse'
	authorized?: Maybe<Scalars['Boolean']>
	accessUuid?: Maybe<Scalars['String']>
	userId?: Maybe<Scalars['String']>
	username?: Maybe<Scalars['String']>
	email?: Maybe<Scalars['String']>
	identifier?: Maybe<Scalars['String']>
	accountType?: Maybe<Scalars['String']>
	verified?: Maybe<Scalars['Boolean']>
	exp?: Maybe<Scalars['String']>
}

export enum AccountType {
	Base = 'BASE',
	Company = 'COMPANY',
	Funding = 'FUNDING',
	Job = 'JOB'
}

export type Address = {
	__typename?: 'Address'
	country: Scalars['String']
	locality?: Maybe<Scalars['String']>
	region?: Maybe<Scalars['String']>
	postalCode?: Maybe<Scalars['Int']>
	street?: Maybe<Scalars['String']>
}

export type AddressInput = {
	country?: Maybe<Scalars['String']>
	locality?: Maybe<Scalars['String']>
	region?: Maybe<Scalars['String']>
	postalCode?: Maybe<Scalars['Int']>
	street?: Maybe<Scalars['String']>
}

export type AggregateRating = {
	__typename?: 'AggregateRating'
	itemReviewed: Scalars['String']
	ratingCount: Scalars['Int']
	reviewCount?: Maybe<Scalars['Int']>
}

export type Applicant = {
	__typename?: 'Applicant'
	applications: Array<Maybe<Scalars['String']>>
	shortlisted: Array<Maybe<Scalars['String']>>
	onhold: Array<Maybe<Scalars['String']>>
	rejected: Array<Maybe<Scalars['String']>>
}

export type Attachment = {
	__typename?: 'Attachment'
	type?: Maybe<Scalars['String']>
	file?: Maybe<Scalars['String']>
	uploadDate?: Maybe<Timestamp>
	url?: Maybe<Scalars['String']>
	user?: Maybe<Scalars['String']>
	folder?: Maybe<Scalars['String']>
}

export type AttachmentInput = {
	type?: Maybe<Scalars['String']>
	file?: Maybe<Scalars['String']>
	user?: Maybe<Scalars['String']>
	folder?: Maybe<Scalars['String']>
}

export type AuthRequestInput = {
	username?: Maybe<Scalars['String']>
	password?: Maybe<Scalars['String']>
}

export type AuthResponse = {
	__typename?: 'AuthResponse'
	access_token?: Maybe<Scalars['String']>
	refresh_token?: Maybe<Scalars['String']>
	valid?: Maybe<Scalars['Boolean']>
}

export enum CacheControlScope {
	Public = 'PUBLIC',
	Private = 'PRIVATE'
}

export type Company = INode & {
	__typename?: 'Company'
	id: Scalars['ID']
	name?: Maybe<Scalars['String']>
	description?: Maybe<Scalars['String']>
	createdBy?: Maybe<Scalars['ID']>
	url?: Maybe<Scalars['String']>
	logo?: Maybe<Scalars['String']>
	location?: Maybe<Scalars['String']>
	founded_year?: Maybe<Scalars['String']>
	noOfEmployees?: Maybe<Range>
	lastActive?: Maybe<Timestamp>
	hiringStatus?: Maybe<Scalars['Boolean']>
	skills?: Maybe<Array<Maybe<Scalars['String']>>>
	createdAt: Timestamp
	updatedAt: Timestamp
}

export type CompanyInput = {
	createdBy: Scalars['ID']
	name: Scalars['String']
	description: Scalars['String']
	url?: Maybe<Scalars['String']>
	logo?: Maybe<Scalars['String']>
	location?: Maybe<Scalars['String']>
	foundedYear?: Maybe<Scalars['String']>
	noOfEmployees?: Maybe<RangeInput>
	hiringStatus?: Maybe<Scalars['Boolean']>
	skills?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type CreateJobInput = {
	name: Scalars['String']
	type: JobType
	category: Array<Scalars['String']>
	desc: Scalars['String']
	skills_required: Array<Scalars['String']>
	sallary: RangeInput
	sallary_max: SallaryInput
	attachment?: Maybe<Array<Maybe<AttachmentInput>>>
	location: Scalars['String']
	status: CurrentStatus
	company: Scalars['String']
}

export enum CurrentStatus {
	Active = 'ACTIVE',
	Hold = 'HOLD',
	Expired = 'EXPIRED'
}

export enum DaysOfWeek {
	Monday = 'MONDAY',
	Tuesday = 'TUESDAY',
	Wednesday = 'WEDNESDAY',
	Thrusday = 'THRUSDAY',
	Friday = 'FRIDAY',
	Staurday = 'STAURDAY',
	Sunday = 'SUNDAY'
}

export type DefaultResponse = {
	__typename?: 'DefaultResponse'
	status?: Maybe<Scalars['Boolean']>
	error?: Maybe<Scalars['String']>
	code?: Maybe<Scalars['Int']>
}

export type Edge = {
	__typename?: 'Edge'
	cursor: Scalars['String']
	node: Array<Result>
}

export type Education = {
	__typename?: 'Education'
	education?: Maybe<Scalars['String']>
	show?: Maybe<Scalars['Boolean']>
}

export type EducationInput = {
	education?: Maybe<Scalars['String']>
	show?: Maybe<Scalars['Boolean']>
}

export type Email = {
	__typename?: 'Email'
	email?: Maybe<Scalars['String']>
	status?: Maybe<EmailStatus>
	show?: Maybe<Scalars['Boolean']>
}

export type EmailInput = {
	email?: Maybe<Scalars['String']>
	show?: Maybe<Scalars['Boolean']>
}

export enum EmailStatus {
	Waiting = 'WAITING',
	Confirmed = 'CONFIRMED',
	Blocked = 'BLOCKED',
	Expired = 'EXPIRED'
}

export enum Gender {
	Male = 'MALE',
	Female = 'FEMALE',
	Other = 'OTHER'
}

export type GeoLocation = {
	__typename?: 'GeoLocation'
	elevation?: Maybe<Scalars['Int']>
	latitude?: Maybe<Scalars['Int']>
	longitude?: Maybe<Scalars['Int']>
	postalCode?: Maybe<Scalars['Int']>
}

export type Id = {
	__typename?: 'Id'
	id: Scalars['ID']
}

export type Identifier = {
	__typename?: 'Identifier'
	identifier: Scalars['String']
	name?: Maybe<Scalars['String']>
	alternateName?: Maybe<Scalars['String']>
	type?: Maybe<Scalars['String']>
	additionalType?: Maybe<Scalars['String']>
	description?: Maybe<Scalars['String']>
	disambiguatingDescription?: Maybe<Scalars['String']>
	headline?: Maybe<Scalars['String']>
	slogan?: Maybe<Scalars['String']>
}

export type IdentifierInput = {
	name?: Maybe<Scalars['String']>
	alternateName?: Maybe<Scalars['String']>
	type?: Maybe<Scalars['String']>
	additionalType?: Maybe<Scalars['String']>
	description?: Maybe<Scalars['String']>
	disambiguatingDescription?: Maybe<Scalars['String']>
	headline?: Maybe<Scalars['String']>
	slogan?: Maybe<Scalars['String']>
}

export type IdInput = {
	id: Scalars['ID']
}

export type INode = {
	id: Scalars['ID']
	createdAt: Timestamp
	updatedAt: Timestamp
}

export type Job = INode & {
	__typename?: 'Job'
	id: Scalars['ID']
	name: Scalars['String']
	type: JobType
	category: Array<Scalars['String']>
	desc: Scalars['String']
	skillsRequired: Array<Scalars['String']>
	sallary?: Maybe<Range>
	location: Scalars['String']
	attachment?: Maybe<Array<Maybe<Attachment>>>
	status?: Maybe<CurrentStatus>
	views?: Maybe<Scalars['Int']>
	usersApplied?: Maybe<Array<Scalars['String']>>
	createdBy?: Maybe<Scalars['String']>
	company: Scalars['String']
	createdAt: Timestamp
	updatedAt: Timestamp
}

export type JobResultCursor = {
	__typename?: 'JobResultCursor'
	edges: Edge
	pageInfo: PageInfo
	totalCount: Scalars['Int']
}

export enum JobType {
	Default = 'DEFAULT',
	Featured = 'FEATURED',
	Premium = 'PREMIUM'
}

export type MapProfilePermission = {
	__typename?: 'MapProfilePermission'
	key?: Maybe<Scalars['String']>
	profileOperations?: Maybe<Array<Maybe<ProfileOperationOptions>>>
}

export type Metadata = {
	__typename?: 'Metadata'
	created_at?: Maybe<Timestamp>
	updated_at?: Maybe<Timestamp>
	published_date?: Maybe<Timestamp>
	end_date?: Maybe<Timestamp>
	last_active?: Maybe<Timestamp>
}

export type Mutation = {
	__typename?: 'Mutation'
	dummy: Scalars['String']
	CreateProfile: Id
	Auth?: Maybe<AuthResponse>
	Logout: DefaultResponse
}

export type MutationCreateProfileArgs = {
	input: ProfileInput
}

export type MutationAuthArgs = {
	input?: Maybe<AuthRequestInput>
}

export type MutationLogoutArgs = {
	input?: Maybe<TokenRequest>
}

export enum OperationEntity {
	Company = 'COMPANY',
	Job = 'JOB',
	Investor = 'INVESTOR'
}

export type PageInfo = {
	__typename?: 'PageInfo'
	endCursor: Scalars['String']
	hasNextPage: Scalars['Boolean']
}

export type Pagination = {
	__typename?: 'Pagination'
	page?: Maybe<Scalars['Int']>
	first?: Maybe<Scalars['Int']>
	after?: Maybe<Scalars['String']>
	offset?: Maybe<Scalars['Int']>
	limit?: Maybe<Scalars['Int']>
	sort?: Maybe<Sort>
	previous?: Maybe<Scalars['String']>
	next?: Maybe<Scalars['String']>
	identifier?: Maybe<Scalars['String']>
}

export type PaginationInput = {
	page?: Maybe<Scalars['Int']>
	first?: Maybe<Scalars['Int']>
	after?: Maybe<Scalars['String']>
	offset?: Maybe<Scalars['Int']>
	limit?: Maybe<Scalars['Int']>
	sort?: Maybe<Sort>
	previous?: Maybe<Scalars['String']>
	next?: Maybe<Scalars['String']>
}

export type PermissionsBase = {
	__typename?: 'PermissionsBase'
	permissions?: Maybe<MapProfilePermission>
}

export type Place = {
	__typename?: 'Place'
	address?: Maybe<Address>
	review?: Maybe<Review>
	aggregateRating?: Maybe<AggregateRating>
	branchCode?: Maybe<Scalars['String']>
	geo?: Maybe<GeoLocation>
}

export type Profile = {
	__typename?: 'Profile'
	identity?: Maybe<Identifier>
	givenName?: Maybe<Scalars['String']>
	middleName?: Maybe<Scalars['String']>
	familyName?: Maybe<Scalars['String']>
	username?: Maybe<Scalars['String']>
	email?: Maybe<Email>
	gender?: Maybe<Gender>
	birthdate?: Maybe<Timestamp>
	currentPosition?: Maybe<Scalars['String']>
	education?: Maybe<Education>
	address?: Maybe<Address>
	security?: Maybe<ProfileSecurity>
	metadata?: Maybe<Metadata>
}

export type ProfileInput = {
	identity?: Maybe<IdentifierInput>
	givenName?: Maybe<Scalars['String']>
	middleName?: Maybe<Scalars['String']>
	familyName?: Maybe<Scalars['String']>
	username?: Maybe<Scalars['String']>
	email?: Maybe<EmailInput>
	gender?: Maybe<Gender>
	birthdate?: Maybe<TimestampInput>
	currentPosition?: Maybe<Scalars['String']>
	education?: Maybe<EducationInput>
	address?: Maybe<AddressInput>
	security?: Maybe<ProfileSecurityInput>
}

export enum ProfileOperationOptions {
	Create = 'CREATE',
	Read = 'READ',
	Update = 'UPDATE',
	Delete = 'DELETE',
	BulkUpdate = 'BULK_UPDATE'
}

export enum ProfileOperations {
	Create = 'CREATE',
	Read = 'READ',
	Update = 'UPDATE',
	Delete = 'DELETE',
	BulkUpdate = 'BULK_UPDATE'
}

export type ProfileSecurity = {
	__typename?: 'ProfileSecurity'
	password?: Maybe<Scalars['String']>
	passwordSalt?: Maybe<Scalars['String']>
	passwordHash?: Maybe<Scalars['String']>
	code?: Maybe<Scalars['String']>
	codeType?: Maybe<Scalars['String']>
	accountType?: Maybe<AccountType>
	verified?: Maybe<Scalars['Boolean']>
}

export type ProfileSecurityInput = {
	password?: Maybe<Scalars['String']>
	accountType?: Maybe<AccountType>
}

export type Query = {
	__typename?: 'Query'
	dummy: Scalars['String']
	ValidateUsername: DefaultResponse
	ValidateEmail: DefaultResponse
	VerifyToken: AccessDetailsResponse
}

export type QueryValidateUsernameArgs = {
	input: ValidateUsernameInput
}

export type QueryValidateEmailArgs = {
	input: ValidateEmailInput
}

export type QueryVerifyTokenArgs = {
	input?: Maybe<TokenRequest>
}

export type Range = {
	__typename?: 'Range'
	min: Scalars['Int']
	max: Scalars['Int']
}

export type RangeInput = {
	min: Scalars['Int']
	max: Scalars['Int']
}

export type Rating = {
	__typename?: 'Rating'
	author?: Maybe<Scalars['String']>
	bestRating?: Maybe<Scalars['Int']>
	explanation?: Maybe<Scalars['String']>
	value?: Maybe<Scalars['Int']>
	worstRating?: Maybe<Scalars['Int']>
}

export type Result = Job | Company

export type Review = {
	__typename?: 'Review'
	itemReviewed?: Maybe<Scalars['String']>
	aspect?: Maybe<Scalars['String']>
	body?: Maybe<Scalars['String']>
	rating?: Maybe<Scalars['String']>
}

export type Sallary = {
	__typename?: 'Sallary'
	value: Scalars['Float']
	currency: Scalars['String']
}

export type SallaryInput = {
	value: Scalars['Float']
	currency: Scalars['String']
}

export enum Sort {
	Asc = 'ASC',
	Desc = 'DESC'
}

export type Subscription = {
	__typename?: 'Subscription'
	dummy: Scalars['String']
}

export type Time = {
	__typename?: 'Time'
	opens?: Maybe<Timestamp>
	closes?: Maybe<Timestamp>
	daysOfWeek?: Maybe<DaysOfWeek>
	validFrom?: Maybe<Timestamp>
	validThrough?: Maybe<Timestamp>
}

export type Timestamp = {
	__typename?: 'Timestamp'
	seconds?: Maybe<Scalars['String']>
	nanos?: Maybe<Scalars['String']>
}

export type TimestampInput = {
	seconds?: Maybe<Scalars['String']>
	nanos?: Maybe<Scalars['String']>
}

export type TokenRequest = {
	token?: Maybe<Scalars['String']>
	accessUuid?: Maybe<Scalars['String']>
	userId?: Maybe<Scalars['String']>
}

export type ValidateEmailInput = {
	email?: Maybe<Scalars['String']>
}

export type ValidateUsernameInput = {
	username?: Maybe<Scalars['String']>
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
	fragment: string
	resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
	| ResolverFn<TResult, TParent, TContext, TArgs>
	| StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
	resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
	subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
	resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
	| SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
	| SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
	| ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
	| SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
	parent: TParent,
	context: TContext,
	info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
	next: NextResolverFn<TResult>,
	parent: TParent,
	args: TArgs,
	context: TContext,
	info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
	Query: ResolverTypeWrapper<{}>
	String: ResolverTypeWrapper<Scalars['String']>
	ValidateUsernameInput: ValidateUsernameInput
	DefaultResponse: ResolverTypeWrapper<DefaultResponse>
	Boolean: ResolverTypeWrapper<Scalars['Boolean']>
	Int: ResolverTypeWrapper<Scalars['Int']>
	ValidateEmailInput: ValidateEmailInput
	TokenRequest: TokenRequest
	AccessDetailsResponse: ResolverTypeWrapper<AccessDetailsResponse>
	Mutation: ResolverTypeWrapper<{}>
	ProfileInput: ProfileInput
	IdentifierInput: IdentifierInput
	EmailInput: EmailInput
	Gender: Gender
	TimestampInput: TimestampInput
	EducationInput: EducationInput
	AddressInput: AddressInput
	ProfileSecurityInput: ProfileSecurityInput
	AccountType: AccountType
	Id: ResolverTypeWrapper<Id>
	ID: ResolverTypeWrapper<Scalars['ID']>
	AuthRequestInput: AuthRequestInput
	AuthResponse: ResolverTypeWrapper<AuthResponse>
	Subscription: ResolverTypeWrapper<{}>
	Date: ResolverTypeWrapper<Scalars['Date']>
	Edge: ResolverTypeWrapper<Omit<Edge, 'node'> & { node: Array<ResolversTypes['Result']> }>
	Result: ResolversTypes['Job'] | ResolversTypes['Company']
	Job: ResolverTypeWrapper<Job>
	INode: ResolversTypes['Job'] | ResolversTypes['Company']
	Timestamp: ResolverTypeWrapper<Timestamp>
	JobType: JobType
	Range: ResolverTypeWrapper<Range>
	Attachment: ResolverTypeWrapper<Attachment>
	CurrentStatus: CurrentStatus
	Company: ResolverTypeWrapper<Company>
	PageInfo: ResolverTypeWrapper<PageInfo>
	Applicant: ResolverTypeWrapper<Applicant>
	Sort: Sort
	Pagination: ResolverTypeWrapper<Pagination>
	PaginationInput: PaginationInput
	Metadata: ResolverTypeWrapper<Metadata>
	Rating: ResolverTypeWrapper<Rating>
	AggregateRating: ResolverTypeWrapper<AggregateRating>
	Review: ResolverTypeWrapper<Review>
	GeoLocation: ResolverTypeWrapper<GeoLocation>
	Address: ResolverTypeWrapper<Address>
	Place: ResolverTypeWrapper<Place>
	EmailStatus: EmailStatus
	Email: ResolverTypeWrapper<Email>
	Identifier: ResolverTypeWrapper<Identifier>
	RangeInput: RangeInput
	IdInput: IdInput
	AttachmentInput: AttachmentInput
	ProfileOperationOptions: ProfileOperationOptions
	MapProfilePermission: ResolverTypeWrapper<MapProfilePermission>
	PermissionsBase: ResolverTypeWrapper<PermissionsBase>
	DaysOfWeek: DaysOfWeek
	Time: ResolverTypeWrapper<Time>
	ProfileOperations: ProfileOperations
	OperationEntity: OperationEntity
	Education: ResolverTypeWrapper<Education>
	ProfileSecurity: ResolverTypeWrapper<ProfileSecurity>
	Profile: ResolverTypeWrapper<Profile>
	CompanyInput: CompanyInput
	Sallary: ResolverTypeWrapper<Sallary>
	Float: ResolverTypeWrapper<Scalars['Float']>
	JobResultCursor: ResolverTypeWrapper<JobResultCursor>
	SallaryInput: SallaryInput
	CreateJobInput: CreateJobInput
	CacheControlScope: CacheControlScope
	Upload: ResolverTypeWrapper<Scalars['Upload']>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
	Query: {}
	String: Scalars['String']
	ValidateUsernameInput: ValidateUsernameInput
	DefaultResponse: DefaultResponse
	Boolean: Scalars['Boolean']
	Int: Scalars['Int']
	ValidateEmailInput: ValidateEmailInput
	TokenRequest: TokenRequest
	AccessDetailsResponse: AccessDetailsResponse
	Mutation: {}
	ProfileInput: ProfileInput
	IdentifierInput: IdentifierInput
	EmailInput: EmailInput
	Gender: Gender
	TimestampInput: TimestampInput
	EducationInput: EducationInput
	AddressInput: AddressInput
	ProfileSecurityInput: ProfileSecurityInput
	AccountType: AccountType
	Id: Id
	ID: Scalars['ID']
	AuthRequestInput: AuthRequestInput
	AuthResponse: AuthResponse
	Subscription: {}
	Date: Scalars['Date']
	Edge: Omit<Edge, 'node'> & { node: Array<ResolversParentTypes['Result']> }
	Result: ResolversParentTypes['Job'] | ResolversParentTypes['Company']
	Job: Job
	INode: ResolversParentTypes['Job'] | ResolversParentTypes['Company']
	Timestamp: Timestamp
	JobType: JobType
	Range: Range
	Attachment: Attachment
	CurrentStatus: CurrentStatus
	Company: Company
	PageInfo: PageInfo
	Applicant: Applicant
	Sort: Sort
	Pagination: Pagination
	PaginationInput: PaginationInput
	Metadata: Metadata
	Rating: Rating
	AggregateRating: AggregateRating
	Review: Review
	GeoLocation: GeoLocation
	Address: Address
	Place: Place
	EmailStatus: EmailStatus
	Email: Email
	Identifier: Identifier
	RangeInput: RangeInput
	IdInput: IdInput
	AttachmentInput: AttachmentInput
	ProfileOperationOptions: ProfileOperationOptions
	MapProfilePermission: MapProfilePermission
	PermissionsBase: PermissionsBase
	DaysOfWeek: DaysOfWeek
	Time: Time
	ProfileOperations: ProfileOperations
	OperationEntity: OperationEntity
	Education: Education
	ProfileSecurity: ProfileSecurity
	Profile: Profile
	CompanyInput: CompanyInput
	Sallary: Sallary
	Float: Scalars['Float']
	JobResultCursor: JobResultCursor
	SallaryInput: SallaryInput
	CreateJobInput: CreateJobInput
	CacheControlScope: CacheControlScope
	Upload: Scalars['Upload']
}>

export type AccessDetailsResponseResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['AccessDetailsResponse'] = ResolversParentTypes['AccessDetailsResponse']
> = ResolversObject<{
	authorized?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	accessUuid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	userId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	accountType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	exp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type AddressResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']
> = ResolversObject<{
	country?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	locality?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	postalCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type AggregateRatingResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['AggregateRating'] = ResolversParentTypes['AggregateRating']
> = ResolversObject<{
	itemReviewed?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	ratingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
	reviewCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type ApplicantResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Applicant'] = ResolversParentTypes['Applicant']
> = ResolversObject<{
	applications?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>
	shortlisted?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>
	onhold?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>
	rejected?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type AttachmentResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Attachment'] = ResolversParentTypes['Attachment']
> = ResolversObject<{
	type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	file?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	uploadDate?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	user?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	folder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type AuthResponseResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']
> = ResolversObject<{
	access_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	refresh_token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	valid?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type CompanyResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']
> = ResolversObject<{
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	createdBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
	url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	founded_year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	noOfEmployees?: Resolver<Maybe<ResolversTypes['Range']>, ParentType, ContextType>
	lastActive?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	hiringStatus?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	skills?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>
	createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>
	updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
	name: 'Date'
}

export type DefaultResponseResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['DefaultResponse'] = ResolversParentTypes['DefaultResponse']
> = ResolversObject<{
	status?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	code?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type EdgeResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']
> = ResolversObject<{
	cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	node?: Resolver<Array<ResolversTypes['Result']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type EducationResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Education'] = ResolversParentTypes['Education']
> = ResolversObject<{
	education?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	show?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type EmailResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Email'] = ResolversParentTypes['Email']
> = ResolversObject<{
	email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	status?: Resolver<Maybe<ResolversTypes['EmailStatus']>, ParentType, ContextType>
	show?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type GeoLocationResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['GeoLocation'] = ResolversParentTypes['GeoLocation']
> = ResolversObject<{
	elevation?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	latitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	longitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	postalCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type IdResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Id'] = ResolversParentTypes['Id']
> = ResolversObject<{
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type IdentifierResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Identifier'] = ResolversParentTypes['Identifier']
> = ResolversObject<{
	identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	alternateName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	additionalType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	disambiguatingDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	headline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	slogan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type INodeResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']
> = ResolversObject<{
	__resolveType: TypeResolveFn<'Job' | 'Company', ParentType, ContextType>
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>
	updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>
}>

export type JobResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']
> = ResolversObject<{
	id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
	name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	type?: Resolver<ResolversTypes['JobType'], ParentType, ContextType>
	category?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
	desc?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	skillsRequired?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>
	sallary?: Resolver<Maybe<ResolversTypes['Range']>, ParentType, ContextType>
	location?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	attachment?: Resolver<Maybe<Array<Maybe<ResolversTypes['Attachment']>>>, ParentType, ContextType>
	status?: Resolver<Maybe<ResolversTypes['CurrentStatus']>, ParentType, ContextType>
	views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	usersApplied?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
	createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	company?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>
	updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type JobResultCursorResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['JobResultCursor'] = ResolversParentTypes['JobResultCursor']
> = ResolversObject<{
	edges?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>
	pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>
	totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type MapProfilePermissionResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['MapProfilePermission'] = ResolversParentTypes['MapProfilePermission']
> = ResolversObject<{
	key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	profileOperations?: Resolver<Maybe<Array<Maybe<ResolversTypes['ProfileOperationOptions']>>>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type MetadataResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']
> = ResolversObject<{
	created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	published_date?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	end_date?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	last_active?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type MutationResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
	dummy?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	CreateProfile?: Resolver<
		ResolversTypes['Id'],
		ParentType,
		ContextType,
		RequireFields<MutationCreateProfileArgs, 'input'>
	>
	Auth?: Resolver<
		Maybe<ResolversTypes['AuthResponse']>,
		ParentType,
		ContextType,
		RequireFields<MutationAuthArgs, never>
	>
	Logout?: Resolver<
		ResolversTypes['DefaultResponse'],
		ParentType,
		ContextType,
		RequireFields<MutationLogoutArgs, never>
	>
}>

export type PageInfoResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']
> = ResolversObject<{
	endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type PaginationResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']
> = ResolversObject<{
	page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	first?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	after?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	offset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	sort?: Resolver<Maybe<ResolversTypes['Sort']>, ParentType, ContextType>
	previous?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type PermissionsBaseResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['PermissionsBase'] = ResolversParentTypes['PermissionsBase']
> = ResolversObject<{
	permissions?: Resolver<Maybe<ResolversTypes['MapProfilePermission']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type PlaceResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Place'] = ResolversParentTypes['Place']
> = ResolversObject<{
	address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>
	review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>
	aggregateRating?: Resolver<Maybe<ResolversTypes['AggregateRating']>, ParentType, ContextType>
	branchCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	geo?: Resolver<Maybe<ResolversTypes['GeoLocation']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type ProfileResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']
> = ResolversObject<{
	identity?: Resolver<Maybe<ResolversTypes['Identifier']>, ParentType, ContextType>
	givenName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	familyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	email?: Resolver<Maybe<ResolversTypes['Email']>, ParentType, ContextType>
	gender?: Resolver<Maybe<ResolversTypes['Gender']>, ParentType, ContextType>
	birthdate?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	currentPosition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	education?: Resolver<Maybe<ResolversTypes['Education']>, ParentType, ContextType>
	address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>
	security?: Resolver<Maybe<ResolversTypes['ProfileSecurity']>, ParentType, ContextType>
	metadata?: Resolver<Maybe<ResolversTypes['Metadata']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type ProfileSecurityResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['ProfileSecurity'] = ResolversParentTypes['ProfileSecurity']
> = ResolversObject<{
	password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	passwordSalt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	passwordHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	codeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	accountType?: Resolver<Maybe<ResolversTypes['AccountType']>, ParentType, ContextType>
	verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type QueryResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
	dummy?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	ValidateUsername?: Resolver<
		ResolversTypes['DefaultResponse'],
		ParentType,
		ContextType,
		RequireFields<QueryValidateUsernameArgs, 'input'>
	>
	ValidateEmail?: Resolver<
		ResolversTypes['DefaultResponse'],
		ParentType,
		ContextType,
		RequireFields<QueryValidateEmailArgs, 'input'>
	>
	VerifyToken?: Resolver<
		ResolversTypes['AccessDetailsResponse'],
		ParentType,
		ContextType,
		RequireFields<QueryVerifyTokenArgs, never>
	>
}>

export type RangeResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Range'] = ResolversParentTypes['Range']
> = ResolversObject<{
	min?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
	max?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type RatingResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Rating'] = ResolversParentTypes['Rating']
> = ResolversObject<{
	author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	bestRating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	explanation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	worstRating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type ResultResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']
> = ResolversObject<{
	__resolveType: TypeResolveFn<'Job' | 'Company', ParentType, ContextType>
}>

export type ReviewResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']
> = ResolversObject<{
	itemReviewed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	aspect?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	rating?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type SallaryResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Sallary'] = ResolversParentTypes['Sallary']
> = ResolversObject<{
	value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
	currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type SubscriptionResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = ResolversObject<{
	dummy?: SubscriptionResolver<ResolversTypes['String'], 'dummy', ParentType, ContextType>
}>

export type TimeResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Time'] = ResolversParentTypes['Time']
> = ResolversObject<{
	opens?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	closes?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	daysOfWeek?: Resolver<Maybe<ResolversTypes['DaysOfWeek']>, ParentType, ContextType>
	validFrom?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	validThrough?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export type TimestampResolvers<
	ContextType = OoJobContext,
	ParentType extends ResolversParentTypes['Timestamp'] = ResolversParentTypes['Timestamp']
> = ResolversObject<{
	seconds?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	nanos?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
	__isTypeOf?: isTypeOfResolverFn<ParentType>
}>

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
	name: 'Upload'
}

export type Resolvers<ContextType = OoJobContext> = ResolversObject<{
	AccessDetailsResponse?: AccessDetailsResponseResolvers<ContextType>
	Address?: AddressResolvers<ContextType>
	AggregateRating?: AggregateRatingResolvers<ContextType>
	Applicant?: ApplicantResolvers<ContextType>
	Attachment?: AttachmentResolvers<ContextType>
	AuthResponse?: AuthResponseResolvers<ContextType>
	Company?: CompanyResolvers<ContextType>
	Date?: GraphQLScalarType
	DefaultResponse?: DefaultResponseResolvers<ContextType>
	Edge?: EdgeResolvers<ContextType>
	Education?: EducationResolvers<ContextType>
	Email?: EmailResolvers<ContextType>
	GeoLocation?: GeoLocationResolvers<ContextType>
	Id?: IdResolvers<ContextType>
	Identifier?: IdentifierResolvers<ContextType>
	INode?: INodeResolvers
	Job?: JobResolvers<ContextType>
	JobResultCursor?: JobResultCursorResolvers<ContextType>
	MapProfilePermission?: MapProfilePermissionResolvers<ContextType>
	Metadata?: MetadataResolvers<ContextType>
	Mutation?: MutationResolvers<ContextType>
	PageInfo?: PageInfoResolvers<ContextType>
	Pagination?: PaginationResolvers<ContextType>
	PermissionsBase?: PermissionsBaseResolvers<ContextType>
	Place?: PlaceResolvers<ContextType>
	Profile?: ProfileResolvers<ContextType>
	ProfileSecurity?: ProfileSecurityResolvers<ContextType>
	Query?: QueryResolvers<ContextType>
	Range?: RangeResolvers<ContextType>
	Rating?: RatingResolvers<ContextType>
	Result?: ResultResolvers
	Review?: ReviewResolvers<ContextType>
	Sallary?: SallaryResolvers<ContextType>
	Subscription?: SubscriptionResolvers<ContextType>
	Time?: TimeResolvers<ContextType>
	Timestamp?: TimestampResolvers<ContextType>
	Upload?: GraphQLScalarType
}>

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = OoJobContext> = Resolvers<ContextType>

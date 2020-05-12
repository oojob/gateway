import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export declare type Maybe<T> = T | null;
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} & {
    [P in K]-?: NonNullable<T[P]>;
};
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    Date: any;
    Upload: any;
};
export declare enum AccountType {
    Base = "BASE",
    Company = "COMPANY",
    Funding = "FUNDING",
    Job = "JOB"
}
export declare type Address = {
    __typename?: 'Address';
    country: Scalars['String'];
    locality?: Maybe<Scalars['String']>;
    region?: Maybe<Scalars['String']>;
    postalCode?: Maybe<Scalars['Int']>;
    street?: Maybe<Scalars['String']>;
};
export declare type AddressInput = {
    country?: Maybe<Scalars['String']>;
    locality?: Maybe<Scalars['String']>;
    region?: Maybe<Scalars['String']>;
    postalCode?: Maybe<Scalars['Int']>;
    street?: Maybe<Scalars['String']>;
};
export declare type AggregateRating = {
    __typename?: 'AggregateRating';
    itemReviewed: Scalars['String'];
    ratingCount: Scalars['Int'];
    reviewCount?: Maybe<Scalars['Int']>;
};
export declare type Applicant = {
    __typename?: 'Applicant';
    applications: Array<Maybe<Scalars['String']>>;
    shortlisted: Array<Maybe<Scalars['String']>>;
    onhold: Array<Maybe<Scalars['String']>>;
    rejected: Array<Maybe<Scalars['String']>>;
};
export declare type Attachment = {
    __typename?: 'Attachment';
    type?: Maybe<Scalars['String']>;
    file?: Maybe<Scalars['String']>;
    uploadDate?: Maybe<Timestamp>;
    url?: Maybe<Scalars['String']>;
    user?: Maybe<Scalars['String']>;
    folder?: Maybe<Scalars['String']>;
};
export declare type AttachmentInput = {
    type?: Maybe<Scalars['String']>;
    file?: Maybe<Scalars['String']>;
    user?: Maybe<Scalars['String']>;
    folder?: Maybe<Scalars['String']>;
};
export declare enum CacheControlScope {
    Public = "PUBLIC",
    Private = "PRIVATE"
}
export declare type Company = INode & {
    __typename?: 'Company';
    id: Scalars['ID'];
    name?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    createdBy?: Maybe<Scalars['ID']>;
    url?: Maybe<Scalars['String']>;
    logo?: Maybe<Scalars['String']>;
    location?: Maybe<Scalars['String']>;
    founded_year?: Maybe<Scalars['String']>;
    noOfEmployees?: Maybe<Range>;
    lastActive?: Maybe<Timestamp>;
    hiringStatus?: Maybe<Scalars['Boolean']>;
    skills?: Maybe<Array<Maybe<Scalars['String']>>>;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export declare type CompanyInput = {
    createdBy: Scalars['ID'];
    name: Scalars['String'];
    description: Scalars['String'];
    url?: Maybe<Scalars['String']>;
    logo?: Maybe<Scalars['String']>;
    location?: Maybe<Scalars['String']>;
    foundedYear?: Maybe<Scalars['String']>;
    noOfEmployees?: Maybe<RangeInput>;
    hiringStatus?: Maybe<Scalars['Boolean']>;
    skills?: Maybe<Array<Maybe<Scalars['String']>>>;
};
export declare type CreateJobInput = {
    name: Scalars['String'];
    type: JobType;
    category: Array<Scalars['String']>;
    desc: Scalars['String'];
    skills_required: Array<Scalars['String']>;
    sallary: RangeInput;
    sallary_max: SallaryInput;
    attachment?: Maybe<Array<Maybe<AttachmentInput>>>;
    location: Scalars['String'];
    status: CurrentStatus;
    company: Scalars['String'];
};
export declare enum CurrentStatus {
    Active = "ACTIVE",
    Hold = "HOLD",
    Expired = "EXPIRED"
}
export declare enum DaysOfWeek {
    Monday = "MONDAY",
    Tuesday = "TUESDAY",
    Wednesday = "WEDNESDAY",
    Thrusday = "THRUSDAY",
    Friday = "FRIDAY",
    Staurday = "STAURDAY",
    Sunday = "SUNDAY"
}
export declare type Edge = {
    __typename?: 'Edge';
    cursor: Scalars['String'];
    node: Array<Result>;
};
export declare type Education = {
    __typename?: 'Education';
    education?: Maybe<Scalars['String']>;
    show?: Maybe<Scalars['Boolean']>;
};
export declare type EducationInput = {
    education?: Maybe<Scalars['String']>;
    show?: Maybe<Scalars['Boolean']>;
};
export declare type Email = {
    __typename?: 'Email';
    email?: Maybe<Scalars['String']>;
    status?: Maybe<EmailStatus>;
    show?: Maybe<Scalars['Boolean']>;
};
export declare type EmailInput = {
    email?: Maybe<Scalars['String']>;
    show?: Maybe<Scalars['Boolean']>;
};
export declare enum EmailStatus {
    Waiting = "WAITING",
    Confirmed = "CONFIRMED",
    Blocked = "BLOCKED",
    Expired = "EXPIRED"
}
export declare enum Gender {
    Male = "MALE",
    Female = "FEMALE",
    Other = "OTHER"
}
export declare type GeoLocation = {
    __typename?: 'GeoLocation';
    elevation?: Maybe<Scalars['Int']>;
    latitude?: Maybe<Scalars['Int']>;
    longitude?: Maybe<Scalars['Int']>;
    postalCode?: Maybe<Scalars['Int']>;
};
export declare type Id = {
    __typename?: 'Id';
    id: Scalars['ID'];
};
export declare type Identifier = {
    __typename?: 'Identifier';
    identifier: Scalars['String'];
    name?: Maybe<Scalars['String']>;
    alternateName?: Maybe<Scalars['String']>;
    type?: Maybe<Scalars['String']>;
    additionalType?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    disambiguatingDescription?: Maybe<Scalars['String']>;
    headline?: Maybe<Scalars['String']>;
    slogan?: Maybe<Scalars['String']>;
};
export declare type IdentifierInput = {
    name?: Maybe<Scalars['String']>;
    alternateName?: Maybe<Scalars['String']>;
    type?: Maybe<Scalars['String']>;
    additionalType?: Maybe<Scalars['String']>;
    description?: Maybe<Scalars['String']>;
    disambiguatingDescription?: Maybe<Scalars['String']>;
    headline?: Maybe<Scalars['String']>;
    slogan?: Maybe<Scalars['String']>;
};
export declare type IdInput = {
    id: Scalars['ID'];
};
export declare type INode = {
    id: Scalars['ID'];
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export declare type Job = INode & {
    __typename?: 'Job';
    id: Scalars['ID'];
    name: Scalars['String'];
    type: JobType;
    category: Array<Scalars['String']>;
    desc: Scalars['String'];
    skillsRequired: Array<Scalars['String']>;
    sallary?: Maybe<Range>;
    location: Scalars['String'];
    attachment?: Maybe<Array<Maybe<Attachment>>>;
    status?: Maybe<CurrentStatus>;
    views?: Maybe<Scalars['Int']>;
    usersApplied?: Maybe<Array<Scalars['String']>>;
    createdBy?: Maybe<Scalars['String']>;
    company: Scalars['String'];
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
export declare type JobResultCursor = {
    __typename?: 'JobResultCursor';
    edges: Edge;
    pageInfo: PageInfo;
    totalCount: Scalars['Int'];
};
export declare enum JobType {
    Default = "DEFAULT",
    Featured = "FEATURED",
    Premium = "PREMIUM"
}
export declare type Metadata = {
    __typename?: 'Metadata';
    created_at?: Maybe<Timestamp>;
    updated_at?: Maybe<Timestamp>;
    published_date?: Maybe<Timestamp>;
    end_date?: Maybe<Timestamp>;
    last_active?: Maybe<Timestamp>;
};
export declare type Mutation = {
    __typename?: 'Mutation';
    dummy: Scalars['String'];
    CreateProfile: Id;
};
export declare type MutationCreateProfileArgs = {
    input: ProfileInput;
};
export declare enum OperationEntity {
    Company = "COMPANY",
    Job = "JOB",
    Investor = "INVESTOR"
}
export declare type PageInfo = {
    __typename?: 'PageInfo';
    endCursor: Scalars['String'];
    hasNextPage: Scalars['Boolean'];
};
export declare type Pagination = {
    __typename?: 'Pagination';
    page?: Maybe<Scalars['Int']>;
    first?: Maybe<Scalars['Int']>;
    after?: Maybe<Scalars['String']>;
    offset?: Maybe<Scalars['Int']>;
    limit?: Maybe<Scalars['Int']>;
    sort?: Maybe<Sort>;
    previous?: Maybe<Scalars['String']>;
    next?: Maybe<Scalars['String']>;
    identifier?: Maybe<Scalars['String']>;
};
export declare type PaginationInput = {
    page?: Maybe<Scalars['Int']>;
    first?: Maybe<Scalars['Int']>;
    after?: Maybe<Scalars['String']>;
    offset?: Maybe<Scalars['Int']>;
    limit?: Maybe<Scalars['Int']>;
    sort?: Maybe<Sort>;
    previous?: Maybe<Scalars['String']>;
    next?: Maybe<Scalars['String']>;
};
export declare type Place = {
    __typename?: 'Place';
    address?: Maybe<Address>;
    review?: Maybe<Review>;
    aggregateRating?: Maybe<AggregateRating>;
    branchCode?: Maybe<Scalars['String']>;
    geo?: Maybe<GeoLocation>;
};
export declare type Profile = {
    __typename?: 'Profile';
    identity?: Maybe<Identifier>;
    givenName?: Maybe<Scalars['String']>;
    middleName?: Maybe<Scalars['String']>;
    familyName?: Maybe<Scalars['String']>;
    username?: Maybe<Scalars['String']>;
    email?: Maybe<Email>;
    gender?: Maybe<Gender>;
    birthdate?: Maybe<Timestamp>;
    currentPosition?: Maybe<Scalars['String']>;
    education?: Maybe<Education>;
    address?: Maybe<Address>;
    security?: Maybe<ProfileSecurity>;
    metadata?: Maybe<Metadata>;
};
export declare type ProfileInput = {
    identity?: Maybe<IdentifierInput>;
    givenName?: Maybe<Scalars['String']>;
    middleName?: Maybe<Scalars['String']>;
    familyName?: Maybe<Scalars['String']>;
    username?: Maybe<Scalars['String']>;
    email?: Maybe<EmailInput>;
    gender?: Maybe<Gender>;
    birthdate?: Maybe<TimestampInput>;
    currentPosition?: Maybe<Scalars['String']>;
    education?: Maybe<EducationInput>;
    address?: Maybe<AddressInput>;
    security?: Maybe<ProfileSecurityInput>;
};
export declare enum ProfileOperations {
    Create = "CREATE",
    Read = "READ",
    Update = "UPDATE",
    Delete = "DELETE",
    BulkUpdate = "BULK_UPDATE"
}
export declare type ProfileSecurity = {
    __typename?: 'ProfileSecurity';
    password?: Maybe<Scalars['String']>;
    passwordSalt?: Maybe<Scalars['String']>;
    passwordHash?: Maybe<Scalars['String']>;
    code?: Maybe<Scalars['String']>;
    codeType?: Maybe<Scalars['String']>;
    accountType?: Maybe<AccountType>;
    verified?: Maybe<Scalars['Boolean']>;
};
export declare type ProfileSecurityInput = {
    password?: Maybe<Scalars['String']>;
    accountType?: Maybe<AccountType>;
};
export declare type Query = {
    __typename?: 'Query';
    dummy: Scalars['String'];
};
export declare type Range = {
    __typename?: 'Range';
    min: Scalars['Int'];
    max: Scalars['Int'];
};
export declare type RangeInput = {
    min: Scalars['Int'];
    max: Scalars['Int'];
};
export declare type Rating = {
    __typename?: 'Rating';
    author?: Maybe<Scalars['String']>;
    bestRating?: Maybe<Scalars['Int']>;
    explanation?: Maybe<Scalars['String']>;
    value?: Maybe<Scalars['Int']>;
    worstRating?: Maybe<Scalars['Int']>;
};
export declare type Result = Job | Company;
export declare type Review = {
    __typename?: 'Review';
    itemReviewed?: Maybe<Scalars['String']>;
    aspect?: Maybe<Scalars['String']>;
    body?: Maybe<Scalars['String']>;
    rating?: Maybe<Scalars['String']>;
};
export declare type Sallary = {
    __typename?: 'Sallary';
    value: Scalars['Float'];
    currency: Scalars['String'];
};
export declare type SallaryInput = {
    value: Scalars['Float'];
    currency: Scalars['String'];
};
export declare enum Sort {
    Asc = "ASC",
    Desc = "DESC"
}
export declare type Subscription = {
    __typename?: 'Subscription';
    dummy: Scalars['String'];
};
export declare type Time = {
    __typename?: 'Time';
    opens?: Maybe<Timestamp>;
    closes?: Maybe<Timestamp>;
    daysOfWeek?: Maybe<DaysOfWeek>;
    validFrom?: Maybe<Timestamp>;
    validThrough?: Maybe<Timestamp>;
};
export declare type Timestamp = {
    __typename?: 'Timestamp';
    seconds?: Maybe<Scalars['String']>;
    nanos?: Maybe<Scalars['String']>;
};
export declare type TimestampInput = {
    seconds?: Maybe<Scalars['String']>;
    nanos?: Maybe<Scalars['String']>;
};
export declare type WithIndex<TObject> = TObject & Record<string, any>;
export declare type ResolversObject<TObject> = WithIndex<TObject>;
export declare type ResolverTypeWrapper<T> = Promise<T> | T;
export declare type StitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | StitchingResolver<TResult, TParent, TContext, TArgs>;
export declare type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export declare type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;
export declare type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export declare type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export declare type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export declare type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export declare type isTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export declare type NextResolverFn<T> = () => Promise<T>;
export declare type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export declare type ResolversTypes = ResolversObject<{
    Query: ResolverTypeWrapper<{}>;
    String: ResolverTypeWrapper<Scalars['String']>;
    Mutation: ResolverTypeWrapper<{}>;
    ProfileInput: ProfileInput;
    IdentifierInput: IdentifierInput;
    EmailInput: EmailInput;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    Gender: Gender;
    TimestampInput: TimestampInput;
    EducationInput: EducationInput;
    AddressInput: AddressInput;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    ProfileSecurityInput: ProfileSecurityInput;
    AccountType: AccountType;
    Id: ResolverTypeWrapper<Id>;
    ID: ResolverTypeWrapper<Scalars['ID']>;
    Subscription: ResolverTypeWrapper<{}>;
    Date: ResolverTypeWrapper<Scalars['Date']>;
    Edge: ResolverTypeWrapper<Omit<Edge, 'node'> & {
        node: Array<ResolversTypes['Result']>;
    }>;
    Result: ResolversTypes['Job'] | ResolversTypes['Company'];
    Job: ResolverTypeWrapper<Job>;
    INode: ResolversTypes['Job'] | ResolversTypes['Company'];
    Timestamp: ResolverTypeWrapper<Timestamp>;
    JobType: JobType;
    Range: ResolverTypeWrapper<Range>;
    Attachment: ResolverTypeWrapper<Attachment>;
    CurrentStatus: CurrentStatus;
    Company: ResolverTypeWrapper<Company>;
    PageInfo: ResolverTypeWrapper<PageInfo>;
    Applicant: ResolverTypeWrapper<Applicant>;
    Sort: Sort;
    Pagination: ResolverTypeWrapper<Pagination>;
    PaginationInput: PaginationInput;
    Metadata: ResolverTypeWrapper<Metadata>;
    Rating: ResolverTypeWrapper<Rating>;
    AggregateRating: ResolverTypeWrapper<AggregateRating>;
    Review: ResolverTypeWrapper<Review>;
    GeoLocation: ResolverTypeWrapper<GeoLocation>;
    Address: ResolverTypeWrapper<Address>;
    Place: ResolverTypeWrapper<Place>;
    EmailStatus: EmailStatus;
    Email: ResolverTypeWrapper<Email>;
    Identifier: ResolverTypeWrapper<Identifier>;
    RangeInput: RangeInput;
    IdInput: IdInput;
    AttachmentInput: AttachmentInput;
    DaysOfWeek: DaysOfWeek;
    Time: ResolverTypeWrapper<Time>;
    ProfileOperations: ProfileOperations;
    OperationEntity: OperationEntity;
    Education: ResolverTypeWrapper<Education>;
    ProfileSecurity: ResolverTypeWrapper<ProfileSecurity>;
    Profile: ResolverTypeWrapper<Profile>;
    CompanyInput: CompanyInput;
    Sallary: ResolverTypeWrapper<Sallary>;
    Float: ResolverTypeWrapper<Scalars['Float']>;
    JobResultCursor: ResolverTypeWrapper<JobResultCursor>;
    SallaryInput: SallaryInput;
    CreateJobInput: CreateJobInput;
    CacheControlScope: CacheControlScope;
    Upload: ResolverTypeWrapper<Scalars['Upload']>;
}>;
export declare type ResolversParentTypes = ResolversObject<{
    Query: {};
    String: Scalars['String'];
    Mutation: {};
    ProfileInput: ProfileInput;
    IdentifierInput: IdentifierInput;
    EmailInput: EmailInput;
    Boolean: Scalars['Boolean'];
    Gender: Gender;
    TimestampInput: TimestampInput;
    EducationInput: EducationInput;
    AddressInput: AddressInput;
    Int: Scalars['Int'];
    ProfileSecurityInput: ProfileSecurityInput;
    AccountType: AccountType;
    Id: Id;
    ID: Scalars['ID'];
    Subscription: {};
    Date: Scalars['Date'];
    Edge: Omit<Edge, 'node'> & {
        node: Array<ResolversParentTypes['Result']>;
    };
    Result: ResolversParentTypes['Job'] | ResolversParentTypes['Company'];
    Job: Job;
    INode: ResolversParentTypes['Job'] | ResolversParentTypes['Company'];
    Timestamp: Timestamp;
    JobType: JobType;
    Range: Range;
    Attachment: Attachment;
    CurrentStatus: CurrentStatus;
    Company: Company;
    PageInfo: PageInfo;
    Applicant: Applicant;
    Sort: Sort;
    Pagination: Pagination;
    PaginationInput: PaginationInput;
    Metadata: Metadata;
    Rating: Rating;
    AggregateRating: AggregateRating;
    Review: Review;
    GeoLocation: GeoLocation;
    Address: Address;
    Place: Place;
    EmailStatus: EmailStatus;
    Email: Email;
    Identifier: Identifier;
    RangeInput: RangeInput;
    IdInput: IdInput;
    AttachmentInput: AttachmentInput;
    DaysOfWeek: DaysOfWeek;
    Time: Time;
    ProfileOperations: ProfileOperations;
    OperationEntity: OperationEntity;
    Education: Education;
    ProfileSecurity: ProfileSecurity;
    Profile: Profile;
    CompanyInput: CompanyInput;
    Sallary: Sallary;
    Float: Scalars['Float'];
    JobResultCursor: JobResultCursor;
    SallaryInput: SallaryInput;
    CreateJobInput: CreateJobInput;
    CacheControlScope: CacheControlScope;
    Upload: Scalars['Upload'];
}>;
export declare type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = ResolversObject<{
    country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    locality?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    region?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    postalCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    street?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type AggregateRatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['AggregateRating'] = ResolversParentTypes['AggregateRating']> = ResolversObject<{
    itemReviewed?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    ratingCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    reviewCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type ApplicantResolvers<ContextType = any, ParentType extends ResolversParentTypes['Applicant'] = ResolversParentTypes['Applicant']> = ResolversObject<{
    applications?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
    shortlisted?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
    onhold?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
    rejected?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type AttachmentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Attachment'] = ResolversParentTypes['Attachment']> = ResolversObject<{
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    file?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    uploadDate?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    folder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type CompanyResolvers<ContextType = any, ParentType extends ResolversParentTypes['Company'] = ResolversParentTypes['Company']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    createdBy?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
    url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    logo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    founded_year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    noOfEmployees?: Resolver<Maybe<ResolversTypes['Range']>, ParentType, ContextType>;
    lastActive?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    hiringStatus?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    skills?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
    name: 'Date';
}
export declare type EdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = ResolversObject<{
    cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    node?: Resolver<Array<ResolversTypes['Result']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type EducationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Education'] = ResolversParentTypes['Education']> = ResolversObject<{
    education?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    show?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type EmailResolvers<ContextType = any, ParentType extends ResolversParentTypes['Email'] = ResolversParentTypes['Email']> = ResolversObject<{
    email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    status?: Resolver<Maybe<ResolversTypes['EmailStatus']>, ParentType, ContextType>;
    show?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type GeoLocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['GeoLocation'] = ResolversParentTypes['GeoLocation']> = ResolversObject<{
    elevation?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    latitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    longitude?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    postalCode?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type IdResolvers<ContextType = any, ParentType extends ResolversParentTypes['Id'] = ResolversParentTypes['Id']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type IdentifierResolvers<ContextType = any, ParentType extends ResolversParentTypes['Identifier'] = ResolversParentTypes['Identifier']> = ResolversObject<{
    identifier?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    alternateName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    additionalType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    disambiguatingDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    headline?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    slogan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type INodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['INode'] = ResolversParentTypes['INode']> = ResolversObject<{
    __resolveType: TypeResolveFn<'Job' | 'Company', ParentType, ContextType>;
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
}>;
export declare type JobResolvers<ContextType = any, ParentType extends ResolversParentTypes['Job'] = ResolversParentTypes['Job']> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    type?: Resolver<ResolversTypes['JobType'], ParentType, ContextType>;
    category?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
    desc?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    skillsRequired?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
    sallary?: Resolver<Maybe<ResolversTypes['Range']>, ParentType, ContextType>;
    location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    attachment?: Resolver<Maybe<Array<Maybe<ResolversTypes['Attachment']>>>, ParentType, ContextType>;
    status?: Resolver<Maybe<ResolversTypes['CurrentStatus']>, ParentType, ContextType>;
    views?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    usersApplied?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
    createdBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    company?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
    updatedAt?: Resolver<ResolversTypes['Timestamp'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type JobResultCursorResolvers<ContextType = any, ParentType extends ResolversParentTypes['JobResultCursor'] = ResolversParentTypes['JobResultCursor']> = ResolversObject<{
    edges?: Resolver<ResolversTypes['Edge'], ParentType, ContextType>;
    pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
    totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type MetadataResolvers<ContextType = any, ParentType extends ResolversParentTypes['Metadata'] = ResolversParentTypes['Metadata']> = ResolversObject<{
    created_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    updated_at?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    published_date?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    end_date?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    last_active?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
    dummy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    CreateProfile?: Resolver<ResolversTypes['Id'], ParentType, ContextType, RequireFields<MutationCreateProfileArgs, 'input'>>;
}>;
export declare type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
    endCursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type PaginationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = ResolversObject<{
    page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    first?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    after?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    offset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    sort?: Resolver<Maybe<ResolversTypes['Sort']>, ParentType, ContextType>;
    previous?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    next?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    identifier?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type PlaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Place'] = ResolversParentTypes['Place']> = ResolversObject<{
    address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
    review?: Resolver<Maybe<ResolversTypes['Review']>, ParentType, ContextType>;
    aggregateRating?: Resolver<Maybe<ResolversTypes['AggregateRating']>, ParentType, ContextType>;
    branchCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    geo?: Resolver<Maybe<ResolversTypes['GeoLocation']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = ResolversObject<{
    identity?: Resolver<Maybe<ResolversTypes['Identifier']>, ParentType, ContextType>;
    givenName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    middleName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    familyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    email?: Resolver<Maybe<ResolversTypes['Email']>, ParentType, ContextType>;
    gender?: Resolver<Maybe<ResolversTypes['Gender']>, ParentType, ContextType>;
    birthdate?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    currentPosition?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    education?: Resolver<Maybe<ResolversTypes['Education']>, ParentType, ContextType>;
    address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
    security?: Resolver<Maybe<ResolversTypes['ProfileSecurity']>, ParentType, ContextType>;
    metadata?: Resolver<Maybe<ResolversTypes['Metadata']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type ProfileSecurityResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileSecurity'] = ResolversParentTypes['ProfileSecurity']> = ResolversObject<{
    password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    passwordSalt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    passwordHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    codeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    accountType?: Resolver<Maybe<ResolversTypes['AccountType']>, ParentType, ContextType>;
    verified?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
    dummy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;
export declare type RangeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Range'] = ResolversParentTypes['Range']> = ResolversObject<{
    min?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    max?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type RatingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Rating'] = ResolversParentTypes['Rating']> = ResolversObject<{
    author?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    bestRating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    explanation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    value?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    worstRating?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type ResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['Result'] = ResolversParentTypes['Result']> = ResolversObject<{
    __resolveType: TypeResolveFn<'Job' | 'Company', ParentType, ContextType>;
}>;
export declare type ReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = ResolversObject<{
    itemReviewed?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    aspect?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    rating?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type SallaryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sallary'] = ResolversParentTypes['Sallary']> = ResolversObject<{
    value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
    currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = ResolversObject<{
    dummy?: SubscriptionResolver<ResolversTypes['String'], "dummy", ParentType, ContextType>;
}>;
export declare type TimeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Time'] = ResolversParentTypes['Time']> = ResolversObject<{
    opens?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    closes?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    daysOfWeek?: Resolver<Maybe<ResolversTypes['DaysOfWeek']>, ParentType, ContextType>;
    validFrom?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    validThrough?: Resolver<Maybe<ResolversTypes['Timestamp']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export declare type TimestampResolvers<ContextType = any, ParentType extends ResolversParentTypes['Timestamp'] = ResolversParentTypes['Timestamp']> = ResolversObject<{
    seconds?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    nanos?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: isTypeOfResolverFn<ParentType>;
}>;
export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
    name: 'Upload';
}
export declare type Resolvers<ContextType = any> = ResolversObject<{
    Address?: AddressResolvers<ContextType>;
    AggregateRating?: AggregateRatingResolvers<ContextType>;
    Applicant?: ApplicantResolvers<ContextType>;
    Attachment?: AttachmentResolvers<ContextType>;
    Company?: CompanyResolvers<ContextType>;
    Date?: GraphQLScalarType;
    Edge?: EdgeResolvers<ContextType>;
    Education?: EducationResolvers<ContextType>;
    Email?: EmailResolvers<ContextType>;
    GeoLocation?: GeoLocationResolvers<ContextType>;
    Id?: IdResolvers<ContextType>;
    Identifier?: IdentifierResolvers<ContextType>;
    INode?: INodeResolvers;
    Job?: JobResolvers<ContextType>;
    JobResultCursor?: JobResultCursorResolvers<ContextType>;
    Metadata?: MetadataResolvers<ContextType>;
    Mutation?: MutationResolvers<ContextType>;
    PageInfo?: PageInfoResolvers<ContextType>;
    Pagination?: PaginationResolvers<ContextType>;
    Place?: PlaceResolvers<ContextType>;
    Profile?: ProfileResolvers<ContextType>;
    ProfileSecurity?: ProfileSecurityResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    Range?: RangeResolvers<ContextType>;
    Rating?: RatingResolvers<ContextType>;
    Result?: ResultResolvers;
    Review?: ReviewResolvers<ContextType>;
    Sallary?: SallaryResolvers<ContextType>;
    Subscription?: SubscriptionResolvers<ContextType>;
    Time?: TimeResolvers<ContextType>;
    Timestamp?: TimestampResolvers<ContextType>;
    Upload?: GraphQLScalarType;
}>;
export declare type IResolvers<ContextType = any> = Resolvers<ContextType>;

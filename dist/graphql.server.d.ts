import { ApolloServer, PubSub } from 'apollo-server-express';
export declare const pubsub: PubSub;
export declare const typeDefs: import("graphql").DocumentNode[];
export declare const resolvers: {
    Query: {
        dummy: () => Promise<string>;
    };
    Mutation: {
        dummy: () => Promise<string>;
    };
    Result: {
        __resolveType: (node: any) => "Company" | "Job";
    };
    INode: {
        __resolveType: (node: any) => "Company" | "Review";
    };
} & {
    Query: {
        ReadCompany: (_: any, { input }: any) => Promise<import("@oojob/protorepo-company-node/service_pb").Company.AsObject>;
        ReadCompanies: (_: any, { input }: any) => Promise<import("@oojob/protorepo-company-node/service_pb").Company.AsObject[]>;
    };
    Mutation: {
        CreateCompany: (_: any, { input }: any, { pubsub }: {
            pubsub: PubSub;
        }) => Promise<import("@oojob/protorepo-company-node/service_pb").Id.AsObject>;
        UpdateCompany: () => void;
        DeleteCompany: () => void;
    };
    Subscription: {
        CompanyCreated: {
            subscribe: (_: any, __: any, { pubsub }: {
                pubsub: PubSub;
            }) => AsyncIterator<unknown, any, undefined>;
        };
    };
} & {
    Query: {
        ReadJob: () => void;
        ReadJobs: () => void;
        ReadMyJobs: () => void;
    };
    Mutation: {
        CreateJob: () => void;
        UpdateJob: () => void;
        DeleteJob: () => void;
    };
};
declare const server: ApolloServer;
export default server;

import { ApolloServer, PubSub } from 'apollo-server-express';
export declare const pubsub: PubSub;
export declare const typeDefs: any[];
export declare const resolvers: {
    Query: {
        dummy: () => string;
    };
    Mutation: {
        dummy: () => Promise<string>;
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
    };
    Subscription: {
        companyCreated: {
            subscribe: (_: any, __: any, { pubsub }: {
                pubsub: PubSub;
            }) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
declare const server: ApolloServer;
export default server;

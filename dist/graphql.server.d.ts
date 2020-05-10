import { ApolloServer, PubSub } from 'apollo-server-express';
export declare const pubsub: PubSub;
export declare const typeDefs: import("graphql").DocumentNode[];
export declare const resolvers: {
    Query: {
        dummy: () => string;
    };
    Mutation: {
        dummy: () => string;
    };
    Subscription: {
        dummy: (_: any, __: any, { pubsub }: {
            pubsub: PubSub;
        }) => AsyncIterator<unknown, any, undefined>;
    };
    Result: {
        __resolveType: (node: any) => "Company" | "Job";
    };
    INode: {
        __resolveType: (node: any) => string;
    };
};
declare const server: ApolloServer;
export default server;

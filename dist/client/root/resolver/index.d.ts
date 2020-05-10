import { PubSub } from 'apollo-server-express';
declare const rootResolvers: {
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
export default rootResolvers;

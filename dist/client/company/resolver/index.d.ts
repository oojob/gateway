import { Company, Id } from '@oojob/protorepo-company-node/service_pb';
import { PubSub } from 'apollo-server-express';
export declare const Query: {
    ReadCompany: (_: any, { input }: any) => Promise<Company.AsObject>;
    ReadCompanies: (_: any, { input }: any) => Promise<Company.AsObject[]>;
};
declare const companyResolvers: {
    Query: {
        ReadCompany: (_: any, { input }: any) => Promise<Company.AsObject>;
        ReadCompanies: (_: any, { input }: any) => Promise<Company.AsObject[]>;
    };
    Mutation: {
        CreateCompany: (_: any, { input }: any, { pubsub }: {
            pubsub: PubSub;
        }) => Promise<Id.AsObject>;
    };
    Subscription: {
        companyCreated: {
            subscribe: (_: any, __: any, { pubsub }: {
                pubsub: PubSub;
            }) => AsyncIterator<unknown, any, undefined>;
        };
    };
};
export default companyResolvers;

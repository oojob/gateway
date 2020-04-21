import { Company, Id } from '@oojob/protorepo-company-node/service_pb';
import { PubSub } from 'apollo-server-express';
export declare const Query: {
    ReadCompany: (_: any, { input }: any) => Promise<Company.AsObject>;
    ReadCompanies: (_: any, { input }: any) => Promise<Company.AsObject[]>;
};
export declare const Mutation: {
    CreateCompany: (_: any, { input }: any, { pubsub }: {
        pubsub: PubSub;
    }) => Promise<Id.AsObject>;
    UpdateCompany: () => void;
    DeleteCompany: () => void;
};
export declare const Subscription: {
    CompanyCreated: {
        subscribe: (_: any, __: any, { pubsub }: {
            pubsub: PubSub;
        }) => AsyncIterator<unknown, any, undefined>;
    };
};
export declare const companyResolvers: {
    Query: {
        ReadCompany: (_: any, { input }: any) => Promise<Company.AsObject>;
        ReadCompanies: (_: any, { input }: any) => Promise<Company.AsObject[]>;
    };
    Mutation: {
        CreateCompany: (_: any, { input }: any, { pubsub }: {
            pubsub: PubSub;
        }) => Promise<Id.AsObject>;
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
};
export default companyResolvers;

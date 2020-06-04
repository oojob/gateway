import { GraphQLError } from 'graphql';
import { Request } from 'express';
declare const createGraphQLErrorFormatter: (req?: Request<import("express-serve-static-core").ParamsDictionary> | undefined) => (error: GraphQLError) => {
    message: string;
    stack: boolean;
};
export default createGraphQLErrorFormatter;

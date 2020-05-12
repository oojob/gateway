import { DefaultResponse as DefaultResponseSchema, Id as IdSchema, MutationResolvers, QueryResolvers } from 'generated/graphql';
export declare const Query: QueryResolvers;
export declare const Mutation: MutationResolvers;
export declare const profileResolvers: {
    Mutation: import("../../../generated/graphql").WithIndex<{
        dummy?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<string>, {}, any, {}> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<string>, {}, any, {}> | undefined;
        CreateProfile?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<IdSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").MutationCreateProfileArgs, "input">> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<IdSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").MutationCreateProfileArgs, "input">> | undefined;
    }>;
    Query: import("../../../generated/graphql").WithIndex<{
        dummy?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<string>, {}, any, {}> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<string>, {}, any, {}> | undefined;
        ValidateUsername?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<DefaultResponseSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").QueryValidateUsernameArgs, "input">> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<DefaultResponseSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").QueryValidateUsernameArgs, "input">> | undefined;
        ValidateEmail?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<DefaultResponseSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").QueryValidateEmailArgs, "input">> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<DefaultResponseSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").QueryValidateEmailArgs, "input">> | undefined;
    }>;
};
export default profileResolvers;

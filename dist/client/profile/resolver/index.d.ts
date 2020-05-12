import { Id as IdSchema, MutationResolvers } from 'generated/graphql';
export declare const Mutation: MutationResolvers;
export declare const profileResolvers: {
    Mutation: import("../../../generated/graphql").WithIndex<{
        dummy?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<string>, {}, any, {}> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<string>, {}, any, {}> | undefined;
        CreateProfile?: import("../../../generated/graphql").ResolverFn<import("../../../generated/graphql").ResolverTypeWrapper<IdSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").MutationCreateProfileArgs, "input">> | import("../../../generated/graphql").StitchingResolver<import("../../../generated/graphql").ResolverTypeWrapper<IdSchema>, {}, any, import("../../../generated/graphql").RequireFields<import("../../../generated/graphql").MutationCreateProfileArgs, "input">> | undefined;
    }>;
};
export default profileResolvers;

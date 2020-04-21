declare const rootResolvers: {
    Query: {
        dummy: () => string;
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
};
export default rootResolvers;

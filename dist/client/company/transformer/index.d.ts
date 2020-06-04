/// <reference types="grpc" />
export declare const readCompany: (arg1: import("@oojob/protorepo-company-node/service_pb").Id) => Promise<unknown>;
export declare const readCompanies: (arg1: import("@oojob/protorepo-company-node/service_pb").Empty, arg2: import("grpc").Metadata | null | undefined) => Promise<unknown>;
export declare const readAllCompanies: (arg1: import("@oojob/protorepo-company-node/service_pb").Pagination) => Promise<unknown>;
export declare const createCompany: (arg1: import("@oojob/protorepo-company-node/service_pb").Company) => Promise<unknown>;
export declare const updateCompany: (arg1: import("@oojob/protorepo-company-node/service_pb").Company) => Promise<unknown>;
export declare const deleteCompany: (arg1: import("@oojob/protorepo-company-node/service_pb").Id) => Promise<unknown>;

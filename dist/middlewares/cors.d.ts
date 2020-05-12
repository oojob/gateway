/// <reference types="express" />
declare const cors: () => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary>;
export default cors;

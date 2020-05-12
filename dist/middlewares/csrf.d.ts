/// <reference types="express" />
declare const csrf: (req: import("express").Request<import("express-serve-static-core").ParamsDictionary>, res: import("express").Response<any>, next: import("express").NextFunction) => void;
export default csrf;

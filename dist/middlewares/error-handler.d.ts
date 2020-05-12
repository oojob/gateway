import { NextFunction, Request, Response } from 'express';
declare const errorHandler: (err: Error, req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>, next: NextFunction) => void;
export default errorHandler;

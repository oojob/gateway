/// <reference types="express" />
import { Logger } from 'winston';
declare const logger: (logger: Logger) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary>;
export default logger;

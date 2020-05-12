import * as express from 'express';
import AppUtils from 'utillity';
import { Application } from 'express';
declare class App {
    app: Application;
    appUtils: AppUtils;
    constructor();
    static bootstrap(): App;
    private applyServer;
    private applyMiddleware;
}
export declare const application: App;
declare const _default: express.Application;
export default _default;

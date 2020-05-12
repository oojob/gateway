import { Application } from 'express';
import { IAppUtils } from './util.interface';
declare class AppUtils implements IAppUtils {
    app: Application;
    constructor(app: Application);
    applyUtils: () => Promise<boolean>;
}
export default AppUtils;

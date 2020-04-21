import { Application } from 'express';
declare class AppSlugify {
    app: Application;
    constructor(app: Application);
    slugify: (text: string) => string;
}
export default AppSlugify;

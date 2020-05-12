import { Application } from 'express';
declare class AppCrypto {
    app: Application;
    private ENCRYPT_ALGORITHM;
    private ENCRYPT_SECRET;
    constructor(app: Application);
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
}
export default AppCrypto;

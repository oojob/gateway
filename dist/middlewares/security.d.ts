import { Application } from 'express';
declare const security: (app: Application, { enableNonce, enableCSP }: {
    enableNonce: boolean;
    enableCSP: boolean;
}) => void;
export default security;

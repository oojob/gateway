import { HealthCheckRequest, HealthCheckResponse } from '@oojob/protorepo-company-node/service_pb';
import { Mail, SendMailReq } from '@oojob/protorepo-mail-node/service_pb';
import { Id } from '@oojob/oojob-protobuf';
export declare const sendMail: (arg1: SendMailReq) => Promise<void>;
export declare const readMail: (arg1: Id, arg2: Mail) => Promise<void>;
export declare const getChannel: () => Promise<unknown>;
export declare const check: (arg1: HealthCheckRequest, arg2: HealthCheckResponse) => Promise<void>;
export declare const close: () => Promise<unknown>;

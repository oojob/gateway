import { Logger } from 'winston';
export declare const loggerOptions: {
    file: {
        level: string;
        filename: string;
        handleExceptions: boolean;
        json: boolean;
        maxsize: number;
        maxFiles: number;
        colorize: boolean;
    };
    console: {
        level: string;
        handleExceptions: boolean;
        json: boolean;
        colorize: boolean;
    };
};
declare const logger: Logger;
export default logger;

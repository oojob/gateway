export declare const IsUserError: unique symbol;
declare class UserError extends Error {
    constructor(message: string);
}
export default UserError;

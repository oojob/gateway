/// <reference types="node" />
import EventEmitter from 'events';
declare class AppEmitter extends EventEmitter {
}
declare const appEmitter: AppEmitter;
export { AppEmitter, appEmitter };
export default appEmitter;

import EventEmitter from 'events'

class AppEmitter extends EventEmitter {}
const appEmitter = new AppEmitter()

export { AppEmitter, appEmitter }
export default appEmitter

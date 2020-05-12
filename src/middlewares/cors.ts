import * as corsLibrary from 'cors'

const { NODE_ENV = 'development', NOW_URL = 'https://oojob.io', FORCE_DEV = false } = process.env
const prodUrls = ['https://oojob.io', 'https://alpha.oojob.io', 'https://beta.oojob.io', NOW_URL]
const isProduction = NODE_ENV === 'production' && !FORCE_DEV

const corsOption = {
	origin: isProduction ? prodUrls.filter(Boolean) : [/localhost/],
	methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
	credentials: true,
	exposedHeaders: ['authorization']
}

const cors = () => corsLibrary(corsOption)
export default cors

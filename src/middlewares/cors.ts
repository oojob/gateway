import * as corsLibrary from 'cors'

const corsOption = {
	origin: true,
	methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTION',
	credentials: true,
	exposedHeaders: ['authorization']
}

const cors = () => corsLibrary(corsOption)
export default cors

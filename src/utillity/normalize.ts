const normalizePort = (portValue: string): number => {
	const port = parseInt(portValue, 10)

	if (isNaN(port)) {
		return 8080
	}

	if (port >= 0) {
		return port
	}

	return port
}

export { normalizePort }

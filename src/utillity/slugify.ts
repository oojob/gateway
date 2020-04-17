import { Application } from 'express'

class AppSlugify {
	public app: Application

	constructor(app: Application) {
		this.app = app
	}

	public slugify = (text: string) => {
		// this.app.logger.info(`Slugify for ${text}`)

		return text
			.toLowerCase()
			.replace(/[^\w ]+/g, '')
			.replace(/ +/g, '-')
	}
}

export default AppSlugify

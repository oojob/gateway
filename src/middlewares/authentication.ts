import * as jwksRsa from 'jwks-rsa'
import * as jwt from 'express-jwt'

const authConfig = {
	domain: 'stayology.eu.auth0.com',
	audience: 'https://stayologyserver.azurewebsites.net/'
}

const checkJwt = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 5,
		jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
	}),

	audience: authConfig.audience,
	issuer: `https://${authConfig.domain}/`,
	algorithm: ['RS256']
})

export default checkJwt

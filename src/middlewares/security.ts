import * as hpp from 'hpp'

import { Application, NextFunction, Request, Response } from 'express'
import { contentSecurityPolicy, frameguard, hsts, ieNoOpen, noSniff, xssFilter } from 'helmet'

import expressEnforcesSsl from 'express-enforces-ssl'
import uuid from 'uuid'

const { NODE_ENV = 'development', FORCE_DEV = false } = process.env
const isProduction = NODE_ENV === 'production' && !FORCE_DEV

const security = (app: Application, { enableNonce, enableCSP }: { enableNonce: boolean; enableCSP: boolean }) => {
	// set trusted ip
	app.set('trust proxy', true)

	// do not show powered by express
	app.set('x-powered-by', false)
	
	// security helmet package
	// Don't expose any software information to hackers.
	app.disable('x-powered-by')

	// Express middleware to protect against HTTP Parameter Pollution attacks
	app.use(hpp())

	if (isProduction) {
		app.use(
			hsts({
				// 5 mins in seconds
				// we will scale this up incrementally to ensure we dont break the
				// app for end users
				// see deployment recommendations here https://hstspreload.org/?domain=spectrum.chat
				maxAge: 300,
				includeSubDomains: true,
				preload: true
			})
		)

		app.use(expressEnforcesSsl())
	}

	// The X-Frame-Options header tells browsers to prevent your webpage from being put in an iframe.
	app.use(frameguard({ action: 'sameorigin' }))

	// Cross-site scripting, abbreviated to “XSS”, is a way attackers can take over webpages.
	app.use(xssFilter())

	// Sets the X-Download-Options to prevent Internet Explorer from executing
	// downloads in your site’s context.
	// @see https://helmetjs.github.io/docs/ienoopen/
	app.use(ieNoOpen())

	// Don’t Sniff Mimetype middleware, noSniff, helps prevent browsers from trying
	// to guess (“sniff”) the MIME type, which can have security implications. It
	// does this by setting the X-Content-Type-Options header to nosniff.
	// @see https://helmetjs.github.io/docs/dont-sniff-mimetype/
	app.use(noSniff())

	if (enableNonce) {
		// Attach a unique "nonce" to every response. This allows use to declare
		// inline scripts as being safe for execution against our content security policy.
		// @see https://helmetjs.github.io/docs/csp/
		app.use((request: Request, response: Response, next: NextFunction) => {
			response.locals.nonce = uuid.v4()
			next()
		})
	}

	// Content Security Policy (CSP)
	// It can be a pain to manage these, but it's a really great habit to get in to.
	// @see https://helmetjs.github.io/docs/csp/
	const cspConfig = {
		directives: {
			// The default-src is the default policy for loading content such as
			// JavaScript, Images, CSS, Fonts, AJAX requests, Frames, HTML5 Media.
			// As you might suspect, is used as fallback for unspecified directives.
			defaultSrc: ["'self'"],

			// Defines valid sources of JavaScript.
			scriptSrc: [
				"'self'",
				"'unsafe-eval'",
				'www.google-analytics.com',
				'cdn.ravenjs.com',
				'cdn.polyfill.io',
				'cdn.amplitude.com',

				// Note: We will execution of any inline scripts that have the following
				// nonce identifier attached to them.
				// This is useful for guarding your application whilst allowing an inline
				// script to do data store rehydration (redux/mobx/apollo) for example.
				// @see https://helmetjs.github.io/docs/csp/
				(_: Request, response: Response) => `'nonce-${response.locals.nonce}'`
			],

			// Defines the origins from which images can be loaded.
			// @note: Leave open to all images, too much image coming from different servers.
			imgSrc: ['https:', 'http:', "'self'", 'data:', 'blob:'],

			// Defines valid sources of stylesheets.
			styleSrc: ["'self'", "'unsafe-inline'"],

			// Applies to XMLHttpRequest (AJAX), WebSocket or EventSource.
			// If not allowed the browser emulates a 400 HTTP status code.
			connectSrc: ['https:', 'wss:'],

			// lists the URLs for workers and embedded frame contents.
			// For example: child-src https://youtube.com would enable
			// embedding videos from YouTube but not from other origins.
			// @note: we allow users to embed any page they want.
			childSrc: ['https:', 'http:'],

			// allows control over Flash and other plugins.
			objectSrc: ["'none'"],

			// restricts the origins allowed to deliver video and audio.
			mediaSrc: ["'none'"]
		},

		// Set to true if you only want browsers to report errors, not block them.
		reportOnly: NODE_ENV === 'development' || Boolean(FORCE_DEV) || false,
		// Necessary because of Zeit CDN usage
		browserSniff: false
	}

	if (enableCSP) {
		app.use(contentSecurityPolicy(cspConfig))
	}
}

export default security

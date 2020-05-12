// import { NextFunction, Response } from 'express'
// import requestIp, { Request } from 'request-ip'

// import Limiter from 'ratelimiter'
// import _debug from 'debug'
// import ms from 'ms'

// const debug = _debug('middlewares:ratelimiter')
// const { SENTRY_NAME = 'unnamed' } = process.env

// const rateLimiter = ({ max, duration }: { max: number; duration: string }) => {
// 	return (req: Request, res: Response, next: NextFunction) => {
// 		// if user is logged in than use their id, otherwise use their ip address
// 		const id = req.user && req.user.id ? req.user.id : requestIp.getClientIp(req)
// 		const limiter = new Limiter({
// 			id: `${SENTRY_NAME}:${id}`,
// 			db: redis,
// 			max,
// 			duration: ms(duration)
// 		})

// 		limiter.get((err, limit) => {
// 			if (err) return next(err)

// 			const remaining = limit.remaining - 1
// 			res.set('X-RateLimit-Limit', String(limit.total))
// 			res.set('X-RateLimit-Remaining', String(remaining))
// 			res.set('X-RateLimit-Reset', String(limit.reset))

// 			const after = (limit.reset - Date.now() / 1000) | 0
// 			const remainingTime = ms(after * 1000, { long: true })
// 			debug('%s of %s requests remaining in the next %s, userId: %s', remaining, limit.total, remainingTime, id)
// 			if (limit.remaining) return next()

// 			const delta = (limit.reset * 1000 - Date.now()) | 0
// 			res.set('Retry-After', String(after))
// 			res.status(429)
// 			if (req.method === 'GET') {
// 				res.send({
// 					message: `rate limit exceeded ${ms(delta, {
// 						long: true
// 					})}. (if this was a mistake let us know at <a href="mailto:support@oojob.io">support@oojob.io</a>)`
// 				})
// 			} else {
// 				res.send({ message: 'Rate limit exceeded, retry in ' + ms(delta, { long: true }) })
// 			}
// 		})
// 	}
// }

// export default rateLimiter

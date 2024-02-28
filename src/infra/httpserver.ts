import express from 'express'
import httpContext from 'express-http-context'
import type { Express, Request, Response, NextFunction } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import moment from 'moment'
import cuid from 'cuid'
import Log from './logger'
import bodyParser from 'body-parser'
import { Metadata } from '../model'

interface Dep {
	hostname: string
	port: number
}

interface LogData {
	timestamp: string
	method: string
	path: string
	rawHeaders: Array<string>
	processTime: string
	body: string
	param: ParamsDictionary
	statusCode: number
	requestID: string
}

export class HttpServer {
	private dep: Dep
	constructor(hostname: string, port: number) {
		this.dep = {
			hostname,
			port
		}
	}

	public serve(): Express {
		let app: Express = express()
		app.use(httpContext.middleware)
		app.use(bodyParser.json())
		app.use((req: Request, res: Response, next: NextFunction) => {
			let id: string = req.headers['X-Custom-Header'.toLowerCase()]?.toString() || cuid()
			httpContext.set('xid', id)
			const meta: Metadata = {
				method: req.method,
				path: req.url,
				transactionID: id,
				timestamp: moment.utc().format()
			}
			httpContext.set('meta', meta)
			res.setHeader('X-Custom-Header', id)
			next()
		})

		app.use((req: Request, res: Response, next: NextFunction) => {
			let tNow: moment.Moment = moment.utc()
			const requestLog: LogData = {
				timestamp: tNow.format(),
				path: req.url,
				method: req.method,
				param: req.params,
				body: req.body || {},
				rawHeaders: req.rawHeaders,
				processTime: '',
				statusCode: 0,
				requestID: httpContext.get('xid')
			}
			Log.info(requestLog)

			req.on('error', err => {
				requestLog.statusCode = res.statusCode
				requestLog.body = JSON.stringify(err)
				Log.error(requestLog)
			})

			res.on('finish', () => {
				let processTime: number = moment.duration(moment.utc().diff(tNow)).asMilliseconds()
				requestLog.processTime = `${processTime} ms`
				requestLog.statusCode = res.statusCode
				res.statusCode >= 300 ? Log.error(requestLog) : Log.info(requestLog)
			})

			next()
		})

		app.use((err: Error, req: Request, resp: Response, next: NextFunction) => {
			next()
		})

		app.listen(this.dep.port, this.dep.hostname, () => {
			this.dep.hostname = typeof (this.dep.hostname) === 'undefined' ? 'localhost' : this.dep.hostname
			Log.info(`Server Running @ 'http://${this.dep.hostname}:${this.dep.port}'`)
			return app
		}).on('error', (_error) => {
			Log.error(_error.message)
		})
		return app
	}
}

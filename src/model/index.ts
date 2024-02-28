import type { Conf as ConfDomain } from '../domain/domain'

interface App {
	env: string
	httpServer: HttpServer
	database: Database
	domain: ConfDomain
}

interface HttpServer {
	hostname: string
	port: number
}

interface Database {
	postgres: Postgres
}

interface Postgres {
	host: string
	port: number
	username: string
	password: string
	database: string
	enableLog: boolean
}

interface Metadata {
	transactionID: string
	path: string
	method: string
	timestamp: string
}

export { App, Database, Postgres, Metadata }

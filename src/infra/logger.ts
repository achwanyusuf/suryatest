import winston from 'winston'

class Log {
	private logEngine: winston.Logger

	constructor() {
		this.logEngine = winston.createLogger({
			level: 'info',
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.metadata(),
				winston.format.prettyPrint()
			),
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({ filename: 'app.log' })
			]
		})
	}

	public info(e: any): void {
		this.logEngine.info(e)
	}

	public warn(e: any): void {
		this.logEngine.warn(e)
	}

	public error(e: any): void {
		this.logEngine.error(e)
	}
}

export default new Log

import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Postgres } from '../model'
import User from '../model/entity/User'
import UserSchedule from '../model/entity/UserSchedule'
import ErrorSchedule from '../model/entity/ErrorSchedule'

export class AppDataSource {
	public DataSource: DataSource
	constructor(db: Postgres) {
		this.DataSource = new DataSource({
			type: 'postgres',
			host: db.host,
			port: db.port,
			username: db.username,
			password: db.password,
			database: db.database,
			synchronize: true,
			logging: db.enableLog,
			entities: [User, UserSchedule, ErrorSchedule],
			migrations: [],
			subscribers: []
		})
	}
}

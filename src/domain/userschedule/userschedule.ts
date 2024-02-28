import moment from 'moment'
import { AppDataSource } from '../../infra/data-source'
import UserSchedule from '../../model/entity/UserSchedule'
import { AsyncUserReturn } from '../../model/user'
import { UpdateUserScheduleInput } from '../../model/userschedule'

interface Dep {
	ds: AppDataSource
}

interface MapProp {
	[key: string]: any
}

export class UserScheduleDom {
	private dep: Dep
	constructor(ds: AppDataSource) {
		this.dep = {
			ds
		}
	}

	public async getOrCreate(local: string): Promise<AsyncUserReturn<UserSchedule, Error>> {
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			const userScheduleRepo = this.dep.ds.DataSource.getRepository(UserSchedule)
			let user = await userScheduleRepo.findOneBy({
				local
			})

			if (user == null) {
				let repo = queryRunner.manager.create(UserSchedule)
				repo.lastDate = moment.utc().utcOffset(local).format('YYYY-MM-DD')
				repo.local = local
				repo.cursor = 0

				user = await repo.save()

				await queryRunner.commitTransaction()
				await queryRunner.release()
			}

			return [user, null]
		} catch (err) {
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			return [null, err as Error]
		}
	}

	public async update(data: UpdateUserScheduleInput, id: number): Promise<Error | null> {
		let val: MapProp = {}
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			if (data.cursor !== 0 && data.cursor !== null) {
				val.cursor = data.cursor
			}

			if (data.lastDate !== '' && data.lastDate !== null) {
				val.lastDate = data.lastDate
			}

			let repo = await queryRunner.manager.update(UserSchedule, {
				id
			}, val)

			if (repo.affected === 0) {
				return Error('record not found')
			}

			await queryRunner.commitTransaction()
			await queryRunner.release()

			return null
		} catch (err) {
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			return null
		}
	}
}

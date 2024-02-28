import { AppDataSource } from '../../infra/data-source'
import ErrorSchedule from '../../model/entity/ErrorSchedule'
import User from '../../model/entity/User'
import { SingleErrorSchedule } from '../../model/errorschedule'
import { AsyncUserReturn } from '../../model/user'

interface Dep {
	ds: AppDataSource
}

export class ErrorScheduleDom {
	private dep: Dep
	constructor(ds: AppDataSource) {
		this.dep = {
			ds
		}
	}

	public async create(data: SingleErrorSchedule): Promise<AsyncUserReturn<ErrorSchedule, Error>> {
		let res: ErrorSchedule
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			let repo = queryRunner.manager.create(ErrorSchedule)
			repo.retryCount = data.retry
			const user = new User()
			user.id = data.user_id
			repo.user = user
			res = await repo.save()

			await queryRunner.commitTransaction()
			await queryRunner.release()
			return [res, null]
		} catch (err) {
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			return [null, err as Error]
		}
	}

	public async update(count: number, id: number): Promise<Error | null> {
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			let repo = await queryRunner.manager.update(ErrorSchedule, {
				id
			}, {
				retryCount: count
			})

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

	public async delete(id: number): Promise<Error | null> {
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {
			let repo = await queryRunner.manager.delete(ErrorSchedule, {
				id
			})

			if (repo.affected === 0) {
				return Error('record not found')
			}

			await queryRunner.commitTransaction()
			await queryRunner.release()

			return null
		} catch (err) {
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			return err as Error
		}
	}

	public async getByWithoutPagination(): Promise<AsyncUserReturn<Array<ErrorSchedule>, Error>> {
		try {
			const userRepo = this.dep.ds.DataSource.getRepository(ErrorSchedule)
			const users = await userRepo.createQueryBuilder('errorschedule').leftJoinAndSelect('errorschedule.user', 'user').getMany()
			return [users, null]
		} catch (err) {
			return [null, err as Error]
		}
	}
}

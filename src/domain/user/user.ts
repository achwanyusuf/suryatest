import moment from 'moment'
import { AppDataSource } from '../../infra/data-source'
import User from '../../model/entity/User'
import type { AsyncUserReturn, UserInput, UserSearch, UserUpdateInput } from '../../model/user'
import { FindOptionsWhere, MoreThan } from 'typeorm'

interface Dep {
	ds: AppDataSource
}

interface MapProp {
	[key: string]: any
}

export class UserDom {
	private dep: Dep
	constructor(ds: AppDataSource) {
		this.dep = {
			ds
		}
	}

	public async create(data: UserInput, id: number): Promise<AsyncUserReturn<User, Error>> {
		let res: User
		const tnow = moment.utc().toDate()
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()
		try {
			let repo = queryRunner.manager.create(User)
			repo.firstname = data.firstname
			repo.lastname = data.lastname
			repo.bod = data.bod.toString()
			repo.local = data.local
			repo.email = data.email
			repo.createdAt = tnow
			repo.updatedAt = tnow
			repo.createdBy = id
			repo.updatedBy = id

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

	public async update(data: UserUpdateInput, id: number, uid: number): Promise<AsyncUserReturn<User, Error>> {
		let res: User
		let val: MapProp = {}
		const tnow = moment.utc().toDate()
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {

			if (data.firstname !== '' && data.firstname !== null) {
				val.firstname = data.firstname
			}

			if (data.lastname !== '' && data.lastname !== null) {
				val.lastname = data.lastname
			}

			if (data.bod !== null) {
				val.bod = data.bod
			}

			if (data.local !== '' && data.local !== null) {
				val.local = data.local
			}

			if (data.email !== '' && data.email !== null) {
				val.email = data.email
			}

			val.updatedAt = tnow
			val.updatedBy = uid

			let repo = await queryRunner.manager.update(User, {
				id
			}, val)

			if (repo.affected === 0) {
				return [null, Error('record not found')]
			}

			res = repo.raw

			const userUpdated = await queryRunner.manager.findOne(User, {
				where: {
					id
				}
			})

			await queryRunner.commitTransaction()
			await queryRunner.release()

			if (userUpdated != null) {
				res = userUpdated
				return [res, null]
			}

			return [null, Error('error when update')]
		} catch (err) {
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			return [null, err as Error]
		}
	}

	public async delete(id: number, uid: number): Promise<Error | null> {
		const queryRunner = this.dep.ds.DataSource.createQueryRunner()
		await queryRunner.connect()
		await queryRunner.startTransaction()

		try {
			let repo = await queryRunner.manager.softDelete(User, {
				id
			})

			if (repo.affected === 0) {
				return Error('record not found')
			}

			repo = await queryRunner.manager.update(User, {
				id
			}, {
				deletedBy: uid
			})

			await queryRunner.commitTransaction()
			await queryRunner.release()

			return null
		} catch (err) {
			await queryRunner.rollbackTransaction()
			await queryRunner.release()
			return err as Error
		}
	}

	public getCondition(v: UserSearch): FindOptionsWhere<User> {
		let condition: FindOptionsWhere<User> = {}
		if (v.id_m !== null) {
			condition.id = MoreThan(v.id_m)
		}

		if (v.local !== null && v.local !== '') {
			condition.local = v.local
		}

		return condition
	}

	public async getByWithoutPagination(v: UserSearch): Promise<AsyncUserReturn<Array<User>, Error>> {
		try {
			const userRepo = this.dep.ds.DataSource.getRepository(User)
			const condition = this.getCondition(v)
			const users = await userRepo.find({
				withDeleted: false,
				where: condition,
				take: 10,
				order: {
					id: 'ASC'
				}
			})

			return [users, null]
		} catch (err) {
			return [null, err as Error]
		}
	}
}

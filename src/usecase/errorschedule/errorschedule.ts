import { ErrorScheduleDom } from '../../domain/errorschedule/errorschedule'
import ErrorSchedule from '../../model/entity/ErrorSchedule'
import { ErrorScheduleWithUser, SingleErrorSchedule } from '../../model/errorschedule'
import { AsyncUserReturn } from '../../model/user'

interface Dep {
	errorSchedule: ErrorScheduleDom
}

export class ErrorScheduleUC {
	private dep: Dep
	constructor(errorSchedule: ErrorScheduleDom) {
		this.dep = {
			errorSchedule
		}
	}

	public async create(data: SingleErrorSchedule): Promise<AsyncUserReturn<SingleErrorSchedule, Error>> {
		try {
			const [errSchedule, err] = await this.dep.errorSchedule.create(data)
			if (err != null) {
				return [null, err]
			}
			return [{
				retry: errSchedule?.retryCount as number,
				user_id: errSchedule?.user.id as number
			}, null]
		} catch (err) {
			return [null, err as Error]
		}
	}

	public async update(v: number, id: number): Promise<Error> {
		try {
			return await this.dep.errorSchedule.update(v, id) as Error
		} catch (err) {
			return err as Error
		}
	}

	public async getByWithoutPagination(): Promise<AsyncUserReturn<Array<ErrorScheduleWithUser>, Error>> {
		try {
			const [errSchedule, err] = await this.dep.errorSchedule.getByWithoutPagination()
			if (err != null) {
				return [null, err]
			}
			const e = errSchedule as Array<ErrorSchedule>
			const errScheduleData: Array<ErrorScheduleWithUser> = e.map(u => {
				return {
					id: u.id,
					retry: u.retryCount,
					user_id: u.user.id,
					email: u.user.email,
					firstname: u.user.firstname,
					lastname: u.user.lastname,
					local: u.user.local
				}
			})
			return [errScheduleData, null]
		} catch (err) {
			return [null, err as Error]
		}
	}

	public async delete(id: number): Promise<Error | null> {
		try {
			return await this.dep.errorSchedule.delete(id)
		} catch (err) {
			return err as Error
		}
	}
}

import { UserScheduleDom } from '../../domain/userschedule/userschedule'
import { AsyncUserReturn } from '../../model/user'
import { SingleUserSchedule, UpdateUserScheduleInput } from '../../model/userschedule'

interface Dep {
	userSchedule: UserScheduleDom
}

export class UserScheduleUC {
	private dep: Dep
	constructor(u: UserScheduleDom) {
		this.dep = {
			userSchedule: u
		}
	}

	public async getOrCreate(local: string): Promise<AsyncUserReturn<SingleUserSchedule, Error>> {
		try {
			const [userSchedule, err] = await this.dep.userSchedule.getOrCreate(local)
			if (err != null) {
				return [{} as SingleUserSchedule, err]
			}
			if (userSchedule == null) {
				return [{} as SingleUserSchedule, Error('empty schdule')]
			}
			return [{
				id: userSchedule.id,
				cursor: userSchedule.cursor,
				lastDate: userSchedule.lastDate,
				local: userSchedule.local
			}, err]
		} catch (err) {
			const knownError = err as Error
			return [{} as SingleUserSchedule, knownError]
		}
	}

	public async update(v: UpdateUserScheduleInput, id: number): Promise<Error> {
		try {
			return await this.dep.userSchedule.update(v, id) as Error
		} catch (err) {
			return err as Error
		}
	}
}

import { UserDom } from '../../domain/user/user'
import httpContext from 'express-http-context'
import { TransformEntityUsersToUsersData, TransformSingleUserResp, type UserInput } from '../../model/user'
import type { AsyncUserReturn, SingleUserResp, UserData, UserSearch, UserUpdateInput } from '../../model/user'
import User from '../../model/entity/User'

interface Dep {
	userDom: UserDom
}

export class UserUC {
	private dep: Dep
	constructor(u: UserDom) {
		this.dep = {
			userDom: u
		}
	}

	public async create(data: UserInput, id: number): Promise<AsyncUserReturn<SingleUserResp, Error>> {
		try {
			const [userData, err] = await this.dep.userDom.create(data, id)
			return [TransformSingleUserResp(userData as User, httpContext.get('meta'), 200, err?.message || ''), err]
		} catch (err) {
			const knownError = err as Error
			return [TransformSingleUserResp(null, httpContext.get('meta'), 400, knownError?.message || ''), knownError]
		}
	}

	public async update(data: UserUpdateInput, vid: number, id: number): Promise<AsyncUserReturn<SingleUserResp, Error>> {
		try {
			const [userData, err] = await this.dep.userDom.update(data, vid, id)
			return [TransformSingleUserResp(userData as User, httpContext.get('meta'), 200, err?.message || ''), err]
		} catch (err) {
			const knownError = err as Error
			return [TransformSingleUserResp(null, httpContext.get('meta'), 400, knownError?.message || ''), knownError]
		}
	}

	public async delete(vid: number, id: number): Promise<AsyncUserReturn<SingleUserResp, Error>> {
		try {
			const err = await this.dep.userDom.delete(vid, id)
			if (err !== null) {
				return [{
					data: {},
					message: err.message,
					metadata: httpContext.get('meta'),
					status: 400
				}, err]
			}
			return [{
				data: {
					id: vid
				},
				message: '',
				metadata: httpContext.get('meta'),
				status: 200
			}, err]
		} catch (err) {
			const knownError = err as Error
			return [{
				data: {},
				message: knownError.message,
				metadata: httpContext.get('meta'),
				status: 400
			}, knownError]
		}
	}

	public async getByWithoutPagination(v: UserSearch): Promise<AsyncUserReturn<Array<UserData>, Error>> {
		try {
			const [users, err] = await this.dep.userDom.getByWithoutPagination(v)
			if (err != null) {
				return [[], err]
			}
			return [TransformEntityUsersToUsersData(users as Array<User>), err]
		} catch (err) {
			const knownError = err as Error
			return [[], knownError]
		}
	}
}

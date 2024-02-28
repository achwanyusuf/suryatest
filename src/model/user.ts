import moment from 'moment'
import { Metadata } from '.'
import User from './entity/User'

interface UserInput {
	firstname: string
	lastname: string
	bod: Date
	local: string
	email: string
}

interface UserUpdateInput {
	firstname: string | null
	lastname: string
	bod: Date | null
	local: string | null
	email: string | null
}

interface UserData {
	id: number
	firstname: string
	lastname: string
	bod: Date
	local: string
	email: string
	createdAt: moment.Moment
	updatedAt: moment.Moment
	deletedAt: moment.Moment | null
	createdBy: number
	updatedBy: number
	deletedBy: number | null
}

interface SingleUserResp {
	metadata: Metadata
	data: UserData | Object
	status: number
	message: string
}

const TransformEntityUsersToUsersData = (v: Array<User>): Array<UserData> => {
	const res: Array<UserData> = v.map(u => {
		return {
			id: u.id,
			firstname: u.firstname,
			lastname: u.lastname,
			bod: moment(u.bod).toDate(),
			local: u.local,
			email: u.email,
			createdAt: moment(u.createdAt),
			createdBy: u.createdBy,
			updatedAt: moment(u.updatedAt),
			updatedBy: u.updatedBy,
			deletedAt: u.deletedBy === null ? null : moment(u.deletedBy),
			deletedBy: u.deletedBy
		}
	})
	return res
}

const TransformSingleUserResp = (v: User | null, meta: Metadata, status: number, message: string): SingleUserResp => {
	const data: UserData | Object = status < 300 && v != null ? {
		id: v.id,
		firstname: v.firstname,
		lastname: v.lastname,
		bod: moment(v.bod).toDate(),
		local: v.local,
		email: v.email,
		createdAt: moment(v.createdAt),
		createdBy: v.createdBy,
		updatedAt: moment(v.updatedAt),
		updatedBy: v.updatedBy,
		deletedAt: v.deletedBy === null ? null : moment(v.deletedBy),
		deletedBy: v.deletedBy
	} : {}

	return {
		metadata: meta,
		data: data,
		message: message,
		status: message !== '' ? 400 : status
	}
}

type Res<T> = T | null
type AsyncUserReturn<R, E> = [Res<R>, Res<E>]

interface UserSearch {
	id_m: number | null
	local: string | null
}

export { UserInput, UserData, TransformSingleUserResp, SingleUserResp, UserUpdateInput, AsyncUserReturn, UserSearch, TransformEntityUsersToUsersData }

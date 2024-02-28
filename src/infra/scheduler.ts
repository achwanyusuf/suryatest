import cron from 'node-cron'
import { UserUC } from '../usecase/user/user'
import { UserScheduleUC } from '../usecase/userschedule/userschedule'
import { SingleUserSchedule } from '../model/userschedule'
import Log from './logger'
import { SendMailUC } from '../usecase/sendmail/sendmail'
import moment from 'moment'
import { ErrorScheduleUC } from '../usecase/errorschedule/errorschedule'

interface Dep {
	user: UserUC
	userSchedule: UserScheduleUC
	sendMail: SendMailUC
	errorSchedule: ErrorScheduleUC
}

export class Scheduler {
	private dep: Dep
	constructor(user: UserUC, userSchedule: UserScheduleUC, sendMail: SendMailUC, errorSchedule: ErrorScheduleUC) {
		this.dep = {
			user,
			userSchedule,
			sendMail,
			errorSchedule
		}
	}

	public sendTZ07 = () => {
		const scheduledJobFunction = cron.schedule('*/7 * * * * *', async () => {
			this.processSendGift('+07:00')
		})

		scheduledJobFunction.start()
	}

	public sendTZ08 = () => {
		const scheduledJobFunction = cron.schedule('*/8 * * * * *', async () => {
			this.processSendGift('+08:00')
		})

		scheduledJobFunction.start()
	}

	public sendTZ09 = () => {
		const scheduledJobFunction = cron.schedule('*/9 * * * * *', async () => {
			this.processSendGift('+09:00')
		})

		scheduledJobFunction.start()
	}

	public retrySend = () => {
		const scheduledJobFunction = cron.schedule('*/10 * * * * *', async () => {
			const [data, err] = await this.dep.errorSchedule.getByWithoutPagination()
			if (err != null || data == null) {
				return
			}
			data.forEach(async (val) => {
				const err = await this.dep.sendMail.sendMail(`${val.firstname} ${val.lastname}`, val.email)
				if (err != null) {
					const nextVal = val.retry + 1
					nextVal === 3 ? this.dep.errorSchedule.delete(val.id) : this.dep.errorSchedule.update(nextVal, val.id)
				} else {
					this.dep.errorSchedule.delete(val.id)
				}
			})

		})

		scheduledJobFunction.start()
	}

	public processSendGift = async (local: string) => {
		let nextCursor: number
		const lastDate: string = moment.utc().utcOffset(local).format('YYYY-MM-DD')
		const [schedule, err] = await this.dep.userSchedule.getOrCreate(local)
		if (err != null) {
			Log.error(err)
			return
		}
		const s = schedule as SingleUserSchedule
		if (s.lastDate !== lastDate) {
			s.cursor = 0
		}
		const [data, errGetUser] = await this.dep.user.getByWithoutPagination({
			id_m: s.cursor,
			local: local
		})
		if (errGetUser !== null) {
			Log.error(err)
			return
		}

		if (data === null || data.length === 0) {
			return
		}

		data?.map(async (d) => {
			const err = await this.dep.sendMail.sendMail(`${d.firstname} ${d.lastname}`, d.email)
			if (err != null) {
				this.dep.errorSchedule.create({
					retry: 0,
					user_id: d.id
				})
			}
			nextCursor = d.id
		})
		this.dep.userSchedule.update({
			cursor: data[data.length - 1].id,
			lastDate
		}, s.id)
	}
}

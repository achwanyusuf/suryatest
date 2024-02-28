import { Domain } from '../domain/domain'
import { ErrorScheduleUC } from './errorschedule/errorschedule'
import { SendMailUC } from './sendmail/sendmail'
import { UserUC } from './user/user'
import { UserScheduleUC } from './userschedule/userschedule'

interface Usecases {
	user: UserUC
	userSchedule: UserScheduleUC
	sendMail: SendMailUC
	errorSchedule: ErrorScheduleUC
}

export class Usecase {
	public usecase: Usecases
	constructor(dom: Domain) {
		this.usecase = {
			user: new UserUC(dom.domain.user),
			userSchedule: new UserScheduleUC(dom.domain.userSchedule),
			sendMail: new SendMailUC(dom.domain.sendMail),
			errorSchedule: new ErrorScheduleUC(dom.domain.errorSchedule)
		};
	}
}

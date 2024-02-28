import { AppDataSource } from '../infra/data-source'
import { UserDom } from './user/user'
import { UserScheduleDom } from './userschedule/userschedule'
import { SendMailDom } from './sendmail/sendmail'
import type { Conf as SendMailConf } from './sendmail/sendmail'
import { ErrorScheduleDom } from './errorschedule/errorschedule'

interface Domains {
	user: UserDom
	userSchedule: UserScheduleDom
	sendMail: SendMailDom
	errorSchedule: ErrorScheduleDom
}

export interface Conf {
	sendmail: SendMailConf
}

export class Domain {
	public domain: Domains
	constructor(ds: AppDataSource, conf: Conf) {
		this.domain = {
			user: new UserDom(ds),
			userSchedule: new UserScheduleDom(ds),
			sendMail: new SendMailDom(conf.sendmail),
			errorSchedule: new ErrorScheduleDom(ds)
		}
	}
}

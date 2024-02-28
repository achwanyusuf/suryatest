import { SendMailDom } from '../../domain/sendmail/sendmail'

interface Dep {
	sendMailDom: SendMailDom
}

export class SendMailUC {
	private dep: Dep
	constructor(u: SendMailDom) {
		this.dep = {
			sendMailDom: u
		}
	}

	public async sendMail(name: string, email: string): Promise<Error | null> {
		try {
			return this.dep.sendMailDom.sendMail(name, email)
		} catch (err) {
			return err as Error
		}
	}
}

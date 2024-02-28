import axios from 'axios'

export interface Conf {
	link: string
}

export class SendMailDom {
	private conf: Conf
	constructor(conf: Conf) {
		this.conf = conf
	}

	public sendMail = async (name: string, email: string): Promise<Error | null> => {
		try {
			const res = await axios.post(this.conf.link, {
				email: email,
				message: `Hey, ${name} it’s your birthday`
			})
			if (res.status === 200) {
				return null
			}
			return Error(`error send email: ${res.data}`)
		} catch (err) {
			return err as Error
		}
	}
}

import { NextFunction, Request, Response } from 'express'
import { UserUC } from '../../../usecase/user/user'
import { UserInput, UserUpdateInput } from '../../../model/user'

interface Dep {
	user: UserUC
}

export class UserHandler {
	private dep: Dep
	constructor(u: UserUC) {
		this.dep = {
			user: u
		}
	}

	public create = (req: Request, res: Response, next: NextFunction) => {
		try {
			const data: UserInput = req.body
			this.dep.user.create(data, 1).then(([user, err]) => {
				err != null ? res.json(user).status(400) : res.json(user).status(201)
			})
		} catch (err) {
			next(err)
		}
	}

	public update = (req: Request, res: Response, next: NextFunction) => {
		try {
			const id: number = +req.params.id
			const data: UserUpdateInput = req.body
			this.dep.user.update(data, id, 1).then(([user, err]) => {
				err != null ? res.json(user).status(400) : res.json(user).status(200)
			})
		} catch (err) {
			next(err)
		}
	}

	public delete = (req: Request, res: Response, next: NextFunction) => {
		try {
			const id: number = +req.params.id
			this.dep.user.delete(id, 1).then(([user, err]) => {
				err != null ? res.json(user).status(400) : res.json(user).status(200)
			})
		} catch (err) {
			next(err)
		}
	}
}

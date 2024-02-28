import { NextFunction, Request, Response, Router } from 'express'
import { Usecase } from '../../usecase/usecase'
import { UserHandler } from './user/user'
import swaggerUI from 'swagger-ui-express'
import jsYaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

interface Dep {
	user: UserHandler
}

export class Rest {
	private dep: Dep
	public router: Router = Router()
	constructor(uc: Usecase, baseUrl: string) {
		this.dep = {
			user: new UserHandler(uc.usecase.user)
		}
		this.route(baseUrl)
	}

	public route(baseUrl: string) {
		this.router.use('/docs', swaggerUI.serve)
		const swaggerDocument = jsYaml.load(fs.readFileSync(path.resolve(__dirname, '../../../conf/swagger.yaml'), 'utf8')) as swaggerUI.JsonObject
		swaggerDocument['servers'] = [{ url: baseUrl }]
		this.router.get('/docs', swaggerUI.setup(swaggerDocument as swaggerUI.JsonObject))
		this.router.post('/user', this.dep.user.create)
		this.router.put('/user/:id', this.dep.user.update)
		this.router.delete('/user/:id', this.dep.user.delete)
	}
}

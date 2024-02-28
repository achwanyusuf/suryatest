
import jsYaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import type { App } from '../model'
import { fillNumber, fillString } from '../utils/fillempty'

const validate = (e: App): App => {
	// check env
	e.env = e?.env ?? 'local'
	e.env = fillString(e?.env, 'local')

	// check httpServer
	e.httpServer.hostname = e?.httpServer?.hostname ?? 'localhost'
	e.httpServer.hostname = fillString(e?.httpServer?.hostname, 'localhost')
	e.httpServer.port = e?.httpServer?.port ?? 3000
	e.httpServer.port = fillNumber(e?.httpServer?.port, 3000)

	return e
}

const loadConfig = (): App => {
	const yaml = jsYaml.load(fs.readFileSync(path.resolve(__dirname, '../../conf/conf.yaml'), 'utf8')) as App
	return validate(yaml)
}

export { loadConfig }

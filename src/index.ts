import { loadConfig } from './infra/config'
import type { App } from './model'
import type { Express } from 'express'
import { HttpServer } from './infra/httpserver'
import { Rest } from './handler/rest/rest'
import { Domain } from './domain/domain'
import { Usecase } from './usecase/usecase'
import { AppDataSource } from './infra/data-source'
import { Scheduler } from './infra/scheduler'

// import config
const conf: App = loadConfig()

// running httpserver
const http: Express = new HttpServer(conf.httpServer.hostname, conf.httpServer.port).serve()

// datasource
const ds: AppDataSource = new AppDataSource(conf.database.postgres)
ds.DataSource.initialize()

// set domain
const dom = new Domain(ds, conf.domain)
const uc = new Usecase(dom)

const schedule = new Scheduler(uc.usecase.user, uc.usecase.userSchedule, uc.usecase.sendMail, uc.usecase.errorSchedule)
// schedule.sendTZ07()
// schedule.sendTZ08()
// schedule.sendTZ09()
schedule.retrySend()

// set rest handler
http.use('/api', new Rest(uc, `http://${conf.httpServer.hostname}:${conf.httpServer.port}/api`).router)

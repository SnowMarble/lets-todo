import 'reflect-metadata'
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import { join } from 'path'

import router from './modules'
import viewRouter from '../views/router.controller'

import { errorMiddleware } from '@/middlewares/error-handler'

export class App {
  private readonly app = express()

  constructor() {
    this.app.set('view engine', 'ejs')
    this.initializeMiddleware()
    this.initializeRouter()
    this.initializeErrorHandler()
  }

  public initializeMiddleware() {
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    )
    this.app.use(express.json())
  }

  public initializeErrorHandler() {
    this.app.use(errorMiddleware)
  }

  public initializeRouter() {
    this.app.use('/public', express.static(join(__dirname, '..', 'public')))
    this.app.use('/api', router)
    this.app.use('/', viewRouter)
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  }
}

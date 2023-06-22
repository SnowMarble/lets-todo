import { Router } from 'express'
import { join } from 'path/posix'
import { key } from '@/common/decorators/key'
import { auth } from '@/middlewares/auth'

import type { Request, Response, NextFunction } from 'express'
import type { PossibleMethod } from '@/common/decorators'

export const wrapper =
  (f: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await f(req, res, next)
    } catch (error) {
      next(error)
    }
  }

export const wrapperWithRes =
  (f: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await f(req, res, next)
      if (res.nosend) return
      res.json(result || {})
    } catch (error) {
      next(error)
    }
  }

export const routerFactory = (controllers: any[]) => {
  const router = Router()

  controllers.forEach((controller) => {
    const { path: rootPath, resources } = Reflect.getMetadata(
      key.path,
      controller
    )

    for (const resource of resources) {
      const { method, path } = Reflect.getMetadata(
        key.resource,
        controller,
        resource
      )
      const needAuth = Reflect.getMetadata(key.auth, controller, resource)

      router[method as PossibleMethod](join(rootPath, path || ''), [
        ...(needAuth ? [wrapper(auth)] : []),
        wrapperWithRes(controller[resource].bind(controller)),
      ])
    }
  })

  return router
}

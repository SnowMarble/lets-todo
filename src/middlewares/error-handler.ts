import { HttpError } from '../common/error'
import type { Request, Response, NextFunction } from 'express'

export const errorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || 500
  const message = error.message || 'Something went wrong'
  if (status === 500) {
    console.error(error)
  }
  res.status(status).json({ status: 'error', message })
}

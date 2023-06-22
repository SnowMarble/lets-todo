import jwt from 'jsonwebtoken'
import { HttpError } from '@/common/error'
import type { Request, Response, NextFunction } from 'express'

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    throw new HttpError(401, 'Unauthorized')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
  req.user = decoded

  return next()
}

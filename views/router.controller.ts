import { Router } from 'express'

import type { Request, Response } from 'express'

const render = (view: string) => (_: Request, res: Response) => res.render(view)

const router = Router()

router.get('/login', render('login'))
router.get('/register', render('register'))
router.get('/', render('index'))
router.get('/me', render('my'))

export default router

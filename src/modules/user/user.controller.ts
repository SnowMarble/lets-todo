import { autoInjectable } from 'tsyringe'
import { Controller, Post, Get, Auth } from '@/common/decorators'
import { UserService } from './user.service'

import type { Request } from 'express'

@autoInjectable()
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  public async login(req: Request) {
    return await this.userService.login(req.body.email, req.body.password)
  }

  @Post('/register')
  public async register(req: Request) {
    return await this.userService.register(
      req.body.email,
      req.body.password,
      req.body.name
    )
  }

  @Auth()
  @Get('/auth')
  public async auth(req: Request) {
    return { user: req.user }
  }

  @Auth()
  @Get('/')
  public async today(req: Request) {
    return this.userService.profile(req.user.id)
  }
}

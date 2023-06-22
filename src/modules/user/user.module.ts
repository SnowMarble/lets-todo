import { registry } from 'tsyringe'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@registry([
  {
    token: UserService,
    useClass: UserService,
  },
  {
    token: 'Controller',
    useClass: UserController,
  },
])
export class UserModule {}

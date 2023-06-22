import { registry, container } from 'tsyringe'

import { UserModule } from './user/user.module'
import { TodoModule } from './todo/todo.module'

import { routerFactory } from '@/common/router-factory'

@registry([{ token: 'Module', useClass: UserModule }])
@registry([{ token: 'Module', useClass: TodoModule }])
export class Module {}

const controllers = container.resolveAll<any>('Controller')

export default routerFactory(controllers)

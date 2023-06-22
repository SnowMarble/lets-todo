import { registry } from 'tsyringe'
import { TodoService } from './todo.service'
import { TodoController } from './todo.controller'

@registry([
  {
    token: TodoService,
    useClass: TodoService,
  },
  {
    token: 'Controller',
    useClass: TodoController,
  },
])
export class TodoModule {}

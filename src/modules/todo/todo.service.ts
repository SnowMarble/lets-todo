import { autoInjectable } from 'tsyringe'
import { TodoEntity } from './todo.entity'
import { TodoMapper } from './todo.mapper'

@autoInjectable()
export class TodoService {
  constructor(private readonly todoMapper: TodoMapper) {}

  public async create(title: string, userId: string) {
    const todo = await TodoEntity.create({ title, userId })
    return this.todoMapper.toPersistence(todo)
  }

  public async edit(id: string, data: { title?: string; completed?: boolean }) {
    const todo = await TodoEntity.findById(id)
    if (!todo) return null
    await todo.edit(data)
  }

  public async delete(id: string) {
    const todo = await TodoEntity.findById(id)
    if (!todo) return null
    await todo.delete()
  }

  public async get(userId: string) {
    const todos = await TodoEntity.findByUserId(userId)
    return todos.map((todo) => this.todoMapper.toPersistence(todo))
  }
}

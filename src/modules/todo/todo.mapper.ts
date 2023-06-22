import { TodoEntity } from './todo.entity'
import type { Todo } from '@prisma/client'

export class TodoMapper {
  public toEntity(record: Todo) {
    const { id, createdAt, updatedAt, ...props } = record
    return new TodoEntity(id, createdAt, updatedAt, props)
  }

  public toPersistence(data: TodoEntity) {
    const { id, createdAt, updatedAt, props } = data
    return {
      id,
      createdAt,
      updatedAt,
      title: props.title,
      completed: props.completed,
    }
  }
}

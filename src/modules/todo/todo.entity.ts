import { Entity } from '@/common'
import { prisma } from '@/common/prisma'
import { autoInjectable } from 'tsyringe'
import { queue } from './stream-queue'

import type { Todo } from '@prisma/client'

@autoInjectable()
export class TodoEntity extends Entity<Todo> {
  public static async create(data: { title: string; userId: string }) {
    const { id, createdAt, updatedAt, ...props } = await prisma.todo.create({
      data: { title: data.title, user: { connect: { id: data.userId } } },
    })
    return new TodoEntity(id, createdAt, updatedAt, props)
  }

  public async edit(data: { title?: string; completed?: boolean }) {
    const isFirstUpdate = this.createdAt.getTime() === this.updatedAt.getTime()

    const { userId } = await prisma.todo.update({
      where: { id: this.id },
      data,
    })  

    if (data?.completed && isFirstUpdate) {
      queue.push(userId)
    }
  }

  public async delete() {
    await prisma.todo.delete({ where: { id: this.id } })
  }

  public static async todoCount(userId: string) {
    return await prisma.todo.count({
      where: { userId },
    })
  }

  public static async findById(id: string) {
    const todo = await prisma.todo.findUnique({ where: { id } })
    if (!todo) return null
    const { id: todoId, createdAt, updatedAt, ...props } = todo
    return new TodoEntity(todoId, createdAt, updatedAt, props)
  }

  public static async findByUserId(id: string) {
    const todos = await prisma.todo.findMany({
      where: {
        userId: id,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return todos.map(
      (todo) => new TodoEntity(todo.id, todo.createdAt, todo.updatedAt, todo)
    )
  }
}

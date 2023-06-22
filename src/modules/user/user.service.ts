import { autoInjectable } from 'tsyringe'
import { UserEntity } from './user.entity'
import { TodoEntity } from '../todo/todo.entity'
import { UserMapper } from './user.mapper'
import { HttpError } from '@/common/error'
import jwt from 'jsonwebtoken'
import { prisma } from '@/common/prisma'

@autoInjectable()
export class UserService {
  constructor(private readonly userMapper: UserMapper) {}

  public async login(email: string, password: string) {
    const user = await UserEntity.findByEmail(email)

    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    const isPasswordValid = await user.validatePassword(password)

    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid password')
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.props.email, name: user.props.name },
      process.env.JWT_SECRET as string
    )

    return { accessToken }
  }

  public async register(email: string, password: string, name: string) {
    const user = await UserEntity.findByEmail(email)

    if (user) {
      throw new HttpError(409, 'User already exists')
    }

    await UserEntity.create({ email, password, name })
  }

  public async profile(userId: string) {
    const user = await UserEntity.findById(userId)

    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    const allTodoCount = await TodoEntity.todoCount(userId)
    const todayTodos = await TodoEntity.findByUserId(userId)

    // SQL query that returns the rank of the user based on the number of todos created  today
    const allUsers = await prisma.todo.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      _count: {
        userId: true,
      },
    })
    
    const rank = allUsers.findIndex((user) => user.userId === userId) + 1

    return {
      user: this.userMapper.toResponse(user),
      todo: {
        total: allTodoCount,
        today: todayTodos.length,
        rank: rank === 0 ? '-' : rank,
      }
    }

  }
}

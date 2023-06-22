import { Entity } from '@/common'
import { prisma } from '@/common/prisma'
import { autoInjectable } from 'tsyringe'
import bcrypt from 'bcrypt'

import type { Prisma, User } from '@prisma/client'

@autoInjectable()
export class UserEntity extends Entity<User> {
  public async validatePassword(password: string) {
    return await bcrypt.compare(password, this.props.password)
  }

  public static async create(data: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const { id, createdAt, updatedAt, ...props } = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    })

    return new UserEntity(id, createdAt, updatedAt, props)
  }

  public static async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return null
    }

    const { id: userId, createdAt, updatedAt, ...props } = user
    return new UserEntity(userId, createdAt, updatedAt, props)
  }

  public static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return null
    }

    const { id, createdAt, updatedAt, ...props } = user
    return new UserEntity(id, createdAt, updatedAt, props)
  }
}

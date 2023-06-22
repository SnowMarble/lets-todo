import { autoInjectable } from 'tsyringe'
import { prisma } from '@/common/prisma'

@autoInjectable()
export class UserRepository {
  public async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } })
  }
}

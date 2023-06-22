import { User } from '@prisma/client'
import { UserEntity } from './user.entity'

export class UserMapper {
  public toEntity(record: User) {
    const { id, createdAt, updatedAt, ...props } = record
    return new UserEntity(id, createdAt, updatedAt, props)
  }

  public toResponse(entity: UserEntity) {
    const { id, props: { email, name } } = entity
    return { id, email, name }
  }
}

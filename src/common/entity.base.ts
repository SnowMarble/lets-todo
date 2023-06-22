type ObjectLiteral = { [key: string]: any }
type PrismaModelToDomainProps<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

export abstract class Entity<
  PrismaDomainProps extends ObjectLiteral,
  DomainProps extends ObjectLiteral = PrismaModelToDomainProps<PrismaDomainProps>
> {
  protected _id: string
  protected _createdAt: Date
  protected _updatedAt: Date
  protected _props: DomainProps

  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    props: DomainProps
  ) {
    this._id = id
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._props = props
  }

  get id(): string {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get props(): DomainProps {
    return this._props
  }

  public static async create(data: ObjectLiteral): Promise<Entity<any>> {
    throw new Error('Method not implemented.')
  }
}

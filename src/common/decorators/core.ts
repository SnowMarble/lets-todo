import { key } from './key'

type Constructor = {
  new (...args: any[]): any
}

export const Controller = (path: string) => (constructor: Constructor) => {
  const prototype = constructor.prototype
  const resources = Object.getOwnPropertyNames(prototype).filter(
    (name) => name !== 'constructor'
  )
  Reflect.defineMetadata(key.path, { path, resources }, constructor.prototype)
}

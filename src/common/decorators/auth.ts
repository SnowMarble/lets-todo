import { key } from './key'

export const Auth = () => (target: any, propertyKey: string) => {
  Reflect.defineMetadata(key.auth, true, target, propertyKey)
}

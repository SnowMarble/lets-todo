import { key } from './key'

export type PossibleMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'

export const Method =
  (method: PossibleMethod, path?: string) => (target: any, pk: string) => {
    Reflect.defineMetadata(key.resource, { method, path }, target, pk)
  }

export const Get = Method.bind(null, 'get')
export const Post = Method.bind(null, 'post')
export const Put = Method.bind(null, 'put')
export const Delete = Method.bind(null, 'delete')
export const Patch = Method.bind(null, 'patch')
export const Options = Method.bind(null, 'options')

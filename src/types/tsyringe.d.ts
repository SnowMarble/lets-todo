import type { InjectionToken } from 'tsyringe'

declare module 'tsyringe' {
  function injectAll(
    token: InjectionToken<any>
  ): (
    target: any,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => any
}

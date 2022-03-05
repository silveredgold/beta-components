export function throwError (location: string, message: string): never {
    throw new Error(`[beta-components/${location}]: ${message}`)
  }
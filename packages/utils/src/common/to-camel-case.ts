import { upperCaseFirst } from './upper-case-first'

export function toCamelCase(str: string): string {
  return str.toLowerCase().split("-").map((n, index) => {
    if (index !== 0) {
      return upperCaseFirst(n)
    }

    return n
  }).join('')
}

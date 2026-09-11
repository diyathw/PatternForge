import type { TestCase, ExecutionResult } from '../../types/domain'
self.onmessage = async (event: MessageEvent<{ code: string; tests: TestCase[] }>) => {
  const results: ExecutionResult[] = []
  for (const test of event.data.tests) {
    try {
      const solve = new Function(`"use strict"; ${event.data.code}\n;return solve;`)() as (input: unknown) => unknown
      const actual = await solve(structuredClone(test.input))
      results.push({ testId: test.id, actual, passed: equal(actual, test.expectedOutput) })
    } catch (error) {
      results.push({ testId: test.id, passed: false, error: String(error) })
    }
  }
  self.postMessage(results)
}
function equal(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v,i) => equal(v,b[i]))
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const x = a as Record<string,unknown>, y = b as Record<string,unknown>
    return Object.keys(x).length === Object.keys(y).length && Object.keys(x).every(k => Object.hasOwn(y,k) && equal(x[k],y[k]))
  }
  return false
}

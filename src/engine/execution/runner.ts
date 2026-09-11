import type { ExecutionResult, LanguageId, TestCase } from '../../types/domain'
export function runCode(language: LanguageId, code: string, tests: TestCase[], signal?: AbortSignal): Promise<ExecutionResult[]> {
  return new Promise((resolve, reject) => {
    const worker = language === 'javascript'
      ? new Worker(new URL('./javascript.worker.ts', import.meta.url), { type: 'module' })
      : new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' })
    const finish = () => { clearTimeout(timer); worker.terminate(); signal?.removeEventListener('abort', cancel) }
    const cancel = () => { finish(); reject(new Error('Run cancelled.')) }
    const timer = setTimeout(() => { finish(); reject(new Error('Time limit exceeded. Check for an infinite loop or reduce the input.')) }, language === 'python' ? 45000 : 5000)
    signal?.addEventListener('abort', cancel, { once: true })
    if (signal?.aborted) { cancel(); return }
    worker.onmessage = (event: MessageEvent<ExecutionResult[] | { error: string }>) => {
      finish()
      if ('error' in event.data) reject(new Error(event.data.error))
      else resolve(event.data)
    }
    worker.onerror = (event) => { finish(); reject(new Error(event.message || 'Unable to start language worker.')) }
    worker.postMessage({ code, tests, indexURL: new URL(`${import.meta.env.BASE_URL}pyodide/`, location.origin).href })
  })
}

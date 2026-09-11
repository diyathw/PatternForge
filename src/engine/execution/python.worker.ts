import type { TestCase, ExecutionResult } from '../../types/domain'
self.onmessage = async (event: MessageEvent<{ code: string; tests: TestCase[]; indexURL: string }>) => {
  try {
    const { loadPyodide } = await import('pyodide')
    const py = await loadPyodide({ indexURL: event.data.indexURL })
    py.globals.set('__source', event.data.code)
    py.globals.set('__tests_json', JSON.stringify(event.data.tests))
    const serialized = await py.runPythonAsync(`
import json
_results = []
for _test in json.loads(__tests_json):
    try:
        _scope = {}
        exec(__source, _scope)
        _actual = _scope['solve'](_test['input'])
        _actual = json.loads(json.dumps(_actual))
        _results.append({'testId': _test['id'], 'passed': _actual == _test['expectedOutput'], 'actual': _actual})
    except Exception as _error:
        _results.append({'testId': _test['id'], 'passed': False, 'error': str(_error)})
json.dumps(_results)
`)
    self.postMessage(JSON.parse(serialized) as ExecutionResult[])
  } catch (error) { self.postMessage({ error: String(error) }) }
}

import { useEffect, useState } from 'react'
import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
// Relative paths (not the bare `monaco-editor/esm/...` specifier) are required here:
// Vite 8's Rolldown-based `?worker` resolver currently fails to resolve bare
// node_modules specifiers for worker entries, but resolves relative paths fine.
import EditorWorker from '../../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js?worker'
import TsWorker from '../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js?worker'
import type { LanguageId } from '../../types/domain'
import { useLearningStore } from '../../store/useLearningStore'
self.MonacoEnvironment = {
  getWorker(_, label) { return label === 'typescript' || label === 'javascript' ? new TsWorker() : new EditorWorker() },
}
loader.config({ monaco })
function useResolvedMonacoTheme() {
  const theme = useLearningStore(s => s.theme)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true)
  useEffect(() => { const mq = window.matchMedia('(prefers-color-scheme: dark)'); const onChange = () => setSystemDark(mq.matches); mq.addEventListener('change', onChange); return () => mq.removeEventListener('change', onChange) }, [])
  const dark = theme === 'system' ? systemDark : theme === 'dark'
  return dark ? 'vs-dark' : 'light'
}
export default function CodeEditor({ language, value, onChange }: { language: LanguageId; value: string; onChange: (value: string) => void }) {
  const monacoTheme = useResolvedMonacoTheme()
  return <Editor height="390px" language={language} value={value} onChange={v => onChange(v ?? '')} theme={monacoTheme} loading={<p>Loading code editor…</p>} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, ariaLabel: `${language} solution editor` }} />
}

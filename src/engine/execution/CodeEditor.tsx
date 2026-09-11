import Editor, { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
// Relative paths (not the bare `monaco-editor/esm/...` specifier) are required here:
// Vite 8's Rolldown-based `?worker` resolver currently fails to resolve bare
// node_modules specifiers for worker entries, but resolves relative paths fine.
import EditorWorker from '../../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js?worker'
import TsWorker from '../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js?worker'
import type { LanguageId } from '../../types/domain'
self.MonacoEnvironment = {
  getWorker(_, label) { return label === 'typescript' || label === 'javascript' ? new TsWorker() : new EditorWorker() },
}
loader.config({ monaco })
export default function CodeEditor({ language, value, onChange }: { language: LanguageId; value: string; onChange: (value: string) => void }) {
  return <Editor height="390px" language={language} value={value} onChange={v => onChange(v ?? '')} theme="vs-dark" loading={<p>Loading code editor…</p>} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, ariaLabel: `${language} solution editor` }} />
}

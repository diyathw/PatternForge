import type { ReactNode } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'

// Render tokens as React text nodes: code never becomes executable HTML.
function renderTokens(tokens: (string | Prism.Token)[]): ReactNode {
  return tokens.map((token,i) => typeof token === 'string' ? token : <span key={i} className={`token ${token.type}`}>{typeof token.content === 'string' ? token.content : renderTokens(Array.isArray(token.content) ? token.content : [token.content])}</span>)
}
export default function CodeBlock({ code, language }: { code: string; language: 'javascript' | 'python' }) {
  return <pre className="syntax-code" aria-label={`${language === 'javascript' ? 'JavaScript' : 'Python'} code`}><code className={`language-${language}`}>{renderTokens(Prism.tokenize(code,Prism.languages[language]))}</code></pre>
}

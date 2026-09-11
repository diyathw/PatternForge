// Copies runtime assets that must be fetched by URL at runtime (not bundled)
// from node_modules into public/, where Vite serves them unprocessed. Runs
// automatically before `dev`/`build` via npm's pre<script> hook, so a fresh
// `npm install` on any machine reproduces public/pyodide/ without anyone
// manually copying files. (Monaco's editor/ts workers are bundled directly by
// Vite via a `?worker` import in CodeEditor.tsx, not staged here — Monaco's
// worker entry files have many transitive relative imports across the package,
// so copying them as static files would leave those imports unresolved.)
import { copyFileSync, mkdirSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))

function stage(destDir, files) {
  mkdirSync(destDir, { recursive: true })
  for (const [src, destName] of files) {
    const from = resolve(root, src)
    const to = resolve(destDir, destName ?? src.split("/").pop())
    if (!existsSync(from)) {
      console.warn(`Skipping missing asset: ${from}`)
      continue
    }
    copyFileSync(from, to)
  }
}

// Pyodide: only the data files fetched at runtime via runner.ts's indexURL.
stage(resolve(root, "public/pyodide"), [
  ["node_modules/pyodide/pyodide.asm.mjs"],
  ["node_modules/pyodide/pyodide.asm.wasm"],
  ["node_modules/pyodide/pyodide-lock.json"],
  ["node_modules/pyodide/python_stdlib.zip"],
])

console.log("Staged static assets into public/pyodide")

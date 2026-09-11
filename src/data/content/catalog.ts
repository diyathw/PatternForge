import type { PatternContent, CodingExercise, VisualizationStep } from '../../types/domain'

/** Shared authoring helper; every record below supplies its own algorithm, invariant and trace. */
export const lessons: PatternContent[] = []
export const practice: CodingExercise[] = []
type Frame = [string, Record<string, unknown>]
export function add(id: string, title: string, prompt: string, explanation: string, complexity: string,
  invariant: string, clues: string[], avoid: string, js: string, py: string,
  cases: [unknown, unknown][], frames: Frame[], mistakes: string[], related: string[],
  difficulty: CodingExercise['difficulty'] = 'easy', shapes: string[] = []) {
  const steps: VisualizationStep[] = frames.map(([description, variables], i) => ({
    id: `${id}-step-${i}`, description, variables, done: i === frames.length - 1,
  }))
  lessons.push({patternId:id, problemStatement:prompt, explanation, visualIntuition:invariant,
    initialValues: cases[0][0], steps, templates:{javascript:js,python:py},
    workedExample: frames.map(([description]) => description).join(' '),
    edgeCases: cases.slice(1).map(([input, expected]) => `${JSON.stringify(input)} → ${JSON.stringify(expected)}`),
    mistakes, relatedPatterns:related,
    meta:{complexity,invariant,recognitionClues:clues,whenToUse:clues.join('; '),whenNotToUse:avoid,pseudocode:frames.map(([d])=>d)},
  })
  practice.push({id:`practice-${id}`,title,patternIds:[id],problemShapeIds:shapes,difficulty,prompt,
    examples:cases.slice(0,2).map(([input,output])=>({input:JSON.stringify(input),output:JSON.stringify(output)})),
    constraints:[complexity,'Implement solve(input). Return the specified JSON-compatible value; do not print it.'],
    starterCode:{javascript:'function solve(input) {\n  // Your solution\n}',python:'def solve(input):\n    # Your solution\n    pass'},
    tests:cases.map(([input,expectedOutput],i)=>({id:`${id}-case-${i}`,input,expectedOutput,hidden:i>=2})),
    hints:[{id:`${id}-hint-1`,level:1,text:clues[0]},{id:`${id}-hint-2`,level:2,text:invariant}],
    solutions:{javascript:js,python:py}})
}

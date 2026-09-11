import { describe,it,expect } from 'vitest'
import { sortingDemo,sortingIds } from './sorting'
describe('sorting traces',()=>{
 for(const id of sortingIds)it(`${id} ends sorted and preserves duplicates`,()=>{
  for(const input of [[],[1],[4,1,4,0,2],[1,2,3],[9,7,5,3]]){
   const demo=sortingDemo(id,input)
   expect(demo.steps.at(-1)?.variables?.result).toEqual([...input].sort((a,b)=>a-b))
   expect(demo.steps[0].variables?.array).toEqual(input)
  }
 })
})

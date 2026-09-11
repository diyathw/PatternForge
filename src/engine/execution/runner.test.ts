import { afterEach, describe, expect, it, vi } from 'vitest'
import { runCode } from './runner'
class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage?: (event: {data:unknown})=>void
  onerror?: (event: {message:string})=>void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() { FakeWorker.instances.push(this) }
}
afterEach(()=>{vi.unstubAllGlobals();vi.useRealTimers();FakeWorker.instances=[]})
describe('execution lifecycle',()=>{
  it('terminates a completed worker and returns test evidence',async()=>{
    vi.stubGlobal('Worker',FakeWorker)
    const promise=runCode('javascript','function solve(x){return x}',[])
    const worker=FakeWorker.instances[0]
    worker.onmessage?.({data:[{testId:'one',passed:true,actual:2}]})
    await expect(promise).resolves.toEqual([{testId:'one',passed:true,actual:2}])
    expect(worker.terminate).toHaveBeenCalledOnce()
  })
  it('kills an infinite run at the time limit',async()=>{
    vi.useFakeTimers();vi.stubGlobal('Worker',FakeWorker)
    const promise=runCode('javascript','while(true){}',[])
    const assertion=expect(promise).rejects.toThrow('Time limit exceeded')
    vi.advanceTimersByTime(5000)
    await assertion
    expect(FakeWorker.instances[0].terminate).toHaveBeenCalledOnce()
  })
  it('cancels a worker when leaving or switching exercises',async()=>{
    vi.stubGlobal('Worker',FakeWorker)
    const controller=new AbortController()
    const promise=runCode('python','def solve(x): return x',[],controller.signal)
    controller.abort()
    await expect(promise).rejects.toThrow('cancelled')
    expect(FakeWorker.instances[0].terminate).toHaveBeenCalledOnce()
  })
})

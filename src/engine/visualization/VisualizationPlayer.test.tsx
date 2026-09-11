import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VisualizationPlayer from './VisualizationPlayer'
import type { PatternContent } from '../../types/domain'
const content: PatternContent = {patternId:'two-pointers',problemStatement:'Pair sum',explanation:'Compare endpoints',visualIntuition:'Move inward',initialValues:[1,2,4],steps:[{id:'start',description:'Compare both endpoints.'},{id:'move',description:'Increase the sum by moving left.'}],templates:{javascript:'',python:''},workedExample:'',edgeCases:[],mistakes:[],relatedPatterns:[]}
describe('visualization navigation',()=>{
 it('allows stepping backward and resetting with matching explanation',()=>{
  render(<VisualizationPlayer content={content} />)
  expect(screen.getByRole('button',{name:'Previous'})).toBeDisabled()
  fireEvent.click(screen.getByRole('button',{name:'Next'}))
  expect(screen.getByText('Increase the sum by moving left.')).toBeInTheDocument()
  expect(screen.getByRole('button',{name:'Next'})).toBeDisabled()
  fireEvent.click(screen.getByRole('button',{name:'Reset'}))
  expect(screen.getByText('Compare both endpoints.')).toBeInTheDocument()
 })
})

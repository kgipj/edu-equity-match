import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDocumentTitle } from './useDocumentTitle'

describe('useDocumentTitle', () => {
  it('builds a branded title from the page title', () => {
    renderHook(() => useDocumentTitle('探索任務'))
    expect(document.title).toBe('探索任務｜共學力')
  })

  it('falls back to the full brand title when no title is given', () => {
    renderHook(() => useDocumentTitle())
    expect(document.title).toBe('共學力｜教育平權青年專長媒合平台')
  })
})

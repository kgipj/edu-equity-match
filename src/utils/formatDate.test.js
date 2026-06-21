import { describe, expect, it } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats an ISO date string as month/day', () => {
    expect(formatDate('2026-06-19T10:00:00.000Z')).toMatch(/^\d{1,2}\/\d{1,2}$/)
  })

  it('returns an em dash for missing values', () => {
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('')).toBe('—')
  })

  it('returns an em dash for invalid date strings instead of throwing', () => {
    expect(() => formatDate('not-a-real-date')).not.toThrow()
    expect(formatDate('not-a-real-date')).toBe('—')
  })
})

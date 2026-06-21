import { describe, expect, it } from 'vitest'
import { LocalStorageRepository } from './repository'

class MemoryStorage {
  constructor() { this.data = new Map() }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null }
  setItem(key, value) { this.data.set(key, String(value)) }
  removeItem(key) { this.data.delete(key) }
}

describe('LocalStorageRepository', () => {
  it('seeds demo content and creates a student', () => {
    const repository = new LocalStorageRepository(new MemoryStorage())
    expect(repository.getTasks().length).toBeGreaterThan(0)
    const student = repository.createStudent({ name: '測試同學', skills: ['網站協助'] })
    expect(student.id).toMatch(/^student-/)
    expect(repository.getStudents()[0].name).toBe('測試同學')
  })

  it('updates a task status without mutating other records', () => {
    const repository = new LocalStorageRepository(new MemoryStorage())
    const [first, second] = repository.getTasks()
    repository.updateTaskStatus(first.id, '已結束')
    expect(repository.getTask(first.id).status).toBe('已結束')
    expect(repository.getTask(second.id).status).toBe(second.status)
  })

  it('returns an empty list when stored data is corrupted instead of throwing', () => {
    const storage = new MemoryStorage()
    storage.setItem('edu_equity_tasks_v1', '{ this is not valid json')
    const repository = new LocalStorageRepository(storage)
    expect(repository.getTasks()).toEqual([])
  })

  it('survives a storage that rejects writes (e.g. quota exceeded)', () => {
    const storage = new MemoryStorage()
    storage.setItem = () => { throw new Error('QuotaExceededError') }
    expect(() => {
      const repository = new LocalStorageRepository(storage)
      repository.createTask({ title: '測試任務', skills: ['網站協助'] })
    }).not.toThrow()
  })
})

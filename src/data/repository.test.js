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

  it('deletes a student record without touching other students', () => {
    const repository = new LocalStorageRepository(new MemoryStorage())
    const first = repository.createStudent({ name: '第一位', skills: ['網站協助'] })
    const second = repository.createStudent({ name: '第二位', skills: ['社群經營'] })

    repository.deleteStudent(first.id)

    const names = repository.getStudents().map((student) => student.name)
    expect(names).not.toContain('第一位')
    expect(names).toContain('第二位')
    expect(repository.getStudents().some((student) => student.id === second.id)).toBe(true)
  })

  it('adds newly seeded tasks without deleting locally created tasks', () => {
    const storage = new MemoryStorage()
    storage.setItem('edu_equity_tasks_v1', JSON.stringify([{ id: 'local-task', title: '自訂任務' }]))

    const repository = new LocalStorageRepository(storage)
    const taskIds = repository.getTasks().map((task) => task.id)

    expect(taskIds).toContain('task-tutoring-reading')
    expect(taskIds).toContain('task-tutoring-math')
    expect(taskIds).toContain('local-task')
  })
})

import { seedApplications, seedStudents, seedTasks } from './seed'

const KEYS = {
  tasks: 'edu_equity_tasks_v1',
  students: 'edu_equity_students_v1',
  applications: 'edu_equity_applications_v1',
}

const clone = (value) => JSON.parse(JSON.stringify(value))
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/**
 * localStorage implementation of the platform data contract.
 * A future Supabase/Firebase adapter only needs to expose the same methods.
 */
export class LocalStorageRepository {
  constructor(storage = window.localStorage) {
    this.storage = storage
    this.seed()
  }

  seed() {
    const defaults = { tasks: seedTasks, students: seedStudents, applications: seedApplications }
    Object.entries(KEYS).forEach(([type, key]) => {
      if (!this.storage.getItem(key)) this.storage.setItem(key, JSON.stringify(defaults[type]))
    })
  }

  read(type) {
    return JSON.parse(this.storage.getItem(KEYS[type]) || '[]')
  }

  write(type, value) {
    this.storage.setItem(KEYS[type], JSON.stringify(value))
    return clone(value)
  }

  getTasks() { return clone(this.read('tasks')) }
  getStudents() { return clone(this.read('students')) }
  getApplications() { return clone(this.read('applications')) }
  getTask(id) { return this.getTasks().find((task) => task.id === id) }

  createStudent(student) {
    const record = { ...student, id: makeId('student'), createdAt: new Date().toISOString() }
    this.write('students', [record, ...this.read('students')])
    return clone(record)
  }

  createTask(task) {
    const record = { ...task, id: makeId('task'), createdAt: new Date().toISOString() }
    this.write('tasks', [record, ...this.read('tasks')])
    return clone(record)
  }

  createApplication(application) {
    const record = { ...application, id: makeId('application'), createdAt: new Date().toISOString() }
    this.write('applications', [record, ...this.read('applications')])
    return clone(record)
  }

  updateTaskStatus(id, status) {
    const tasks = this.read('tasks').map((task) => task.id === id ? { ...task, status } : task)
    this.write('tasks', tasks)
    return clone(tasks.find((task) => task.id === id))
  }

  reset() {
    Object.values(KEYS).forEach((key) => this.storage.removeItem(key))
    this.seed()
  }
}

export const createRepository = (storage) => new LocalStorageRepository(storage)

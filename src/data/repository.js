import { seedApplications, seedStudents, seedTasks } from './seed'
import { getBackendConfig } from './backendConfig'
import { getSupabaseClient } from './supabaseClient'
import { SupabaseRepository } from './supabaseRepository'
import { clone, makeId } from './recordUtils'

const KEYS = {
  tasks: 'edu_equity_tasks_v1',
  students: 'edu_equity_students_v1',
  applications: 'edu_equity_applications_v1',
}

/**
 * localStorage implementation of the platform data contract.
 * Supabase/Firebase adapters only need to expose the same methods.
 */
export class LocalStorageRepository {
  constructor(storage = window.localStorage) {
    this.storage = storage
    this.backend = 'localStorage'
    this.canReset = true
    this.seed()
  }

  seed() {
    const defaults = { tasks: seedTasks, students: seedStudents, applications: seedApplications }
    Object.entries(KEYS).forEach(([type, key]) => {
      if (!this.storage.getItem(key)) this.storage.setItem(key, JSON.stringify(defaults[type]))
    })

    // Add new demo tasks without erasing tasks or applications people created locally.
    const storedTasks = this.read('tasks')
    const storedTaskIds = new Set(storedTasks.map((task) => task.id))
    const missingTasks = seedTasks.filter((task) => !storedTaskIds.has(task.id))
    if (missingTasks.length) this.write('tasks', [...missingTasks, ...storedTasks])
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

  deleteStudent(id) {
    const nextStudents = this.read('students').filter((student) => student.id !== id)
    this.write('students', nextStudents)
    return id
  }

  createTask(task) {
    const record = { ...task, id: makeId('task'), createdAt: new Date().toISOString() }
    this.write('tasks', [record, ...this.read('tasks')])
    return clone(record)
  }

  deleteTask(id) {
    const nextTasks = this.read('tasks').filter((task) => task.id !== id)
    const nextApplications = this.read('applications').filter((application) => application.taskId !== id)
    this.write('tasks', nextTasks)
    this.write('applications', nextApplications)
    return id
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

export const createRepository = (storage) => {
  const config = getBackendConfig()
  if (config.backend === 'supabase') return new SupabaseRepository(getSupabaseClient(config))
  return new LocalStorageRepository(storage)
}

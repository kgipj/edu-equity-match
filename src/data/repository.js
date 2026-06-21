import { seedApplications, seedStudents, seedTasks } from './seed'

const KEYS = {
  tasks: 'edu_equity_tasks_v1',
  students: 'edu_equity_students_v1',
  applications: 'edu_equity_applications_v1',
}

const clone = (value) => JSON.parse(JSON.stringify(value))
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

/**
 * 記憶體版儲存：當 localStorage 不可用（無痕模式、停用儲存、容量已滿）時的退路。
 * 介面與 Web Storage 一致，App 仍可運作，只是資料不會跨頁面重整保留。
 */
class MemoryStorage {
  constructor() { this.map = new Map() }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null }
  setItem(key, value) { this.map.set(key, String(value)) }
  removeItem(key) { this.map.delete(key) }
}

/**
 * 偵測可用的儲存：先用探針驗證 localStorage 可讀寫，失敗則退回記憶體儲存。
 * 這樣即使在無痕模式或儲存被封鎖的環境，App 也不會在啟動時崩潰。
 */
const resolveStorage = () => {
  try {
    const probe = '__edu_equity_probe__'
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return new MemoryStorage()
  }
}

/**
 * localStorage implementation of the platform data contract.
 * A future Supabase/Firebase adapter only needs to expose the same methods.
 */
export class LocalStorageRepository {
  constructor(storage = resolveStorage()) {
    this.storage = storage
    this.seed()
  }

  seed() {
    const defaults = { tasks: seedTasks, students: seedStudents, applications: seedApplications }
    Object.entries(KEYS).forEach(([type, key]) => {
      try {
        if (!this.storage.getItem(key)) this.storage.setItem(key, JSON.stringify(defaults[type]))
      } catch {
        // seed 失敗（容量已滿等）不應阻擋 App 啟動。
      }
    })
  }

  read(type) {
    try {
      return JSON.parse(this.storage.getItem(KEYS[type]) || '[]')
    } catch {
      // 資料毀損時回退為空陣列，避免整個 App 崩潰。
      return []
    }
  }

  write(type, value) {
    try {
      this.storage.setItem(KEYS[type], JSON.stringify(value))
    } catch {
      // 容量已滿或儲存不可用：保留呼叫端拿到的結果，僅略過持久化。
    }
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
    Object.values(KEYS).forEach((key) => {
      try {
        this.storage.removeItem(key)
      } catch {
        // 略過：移除失敗不影響後續重新 seed。
      }
    })
    this.seed()
  }
}

export const createRepository = (storage) => new LocalStorageRepository(storage)

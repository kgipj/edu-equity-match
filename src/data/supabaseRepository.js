import { makeId } from './recordUtils'

const noRows = (data) => data || []

const raise = (error) => {
  if (error) throw new Error(error.message || '資料庫操作失敗')
}

const toTask = (task) => ({
  id: task.id || makeId('task'),
  title: task.title,
  organization: task.organization,
  summary: task.summary,
  details: task.details,
  skills: task.skills || [],
  mode: task.mode,
  time: task.time,
  volunteer_hours: Boolean(task.volunteerHours),
  contact: task.contact,
  status: task.status || '招募中',
  location: task.location || '',
  privacy_consent: Boolean(task.privacyConsent),
})

const fromTask = (row) => ({
  id: row.id,
  title: row.title,
  organization: row.organization,
  summary: row.summary,
  details: row.details,
  skills: row.skills || [],
  mode: row.mode,
  time: row.time,
  volunteerHours: Boolean(row.volunteer_hours),
  contact: row.contact,
  status: row.status,
  location: row.location || '',
  privacyConsent: Boolean(row.privacy_consent),
  createdAt: row.created_at,
})

const toStudent = (student) => ({
  id: student.id || makeId('student'),
  name: student.name,
  school: student.school,
  identity: student.identity,
  background: student.background,
  skills: student.skills || [],
  bio: student.bio,
  availability: student.availability,
  contact: student.contact,
  needs_hours: Boolean(student.needsHours),
  is_public: Boolean(student.isPublic),
  privacy_consent: Boolean(student.privacyConsent),
})

const fromStudent = (row) => ({
  id: row.id,
  name: row.name,
  school: row.school,
  identity: row.identity,
  background: row.background,
  skills: row.skills || [],
  bio: row.bio,
  availability: row.availability,
  contact: row.contact,
  needsHours: Boolean(row.needs_hours),
  isPublic: Boolean(row.is_public),
  privacyConsent: Boolean(row.privacy_consent),
  createdAt: row.created_at,
})

const toApplication = (application) => ({
  id: application.id || makeId('application'),
  task_id: application.taskId,
  student_name: application.studentName,
  contact: application.contact,
  skill: application.skill,
  reason: application.reason,
  privacy_consent: Boolean(application.privacyConsent),
})

const fromApplication = (row) => ({
  id: row.id,
  taskId: row.task_id,
  studentName: row.student_name,
  contact: row.contact,
  skill: row.skill,
  reason: row.reason,
  privacyConsent: Boolean(row.privacy_consent),
  createdAt: row.created_at,
})

export class SupabaseRepository {
  constructor(client) {
    this.client = client
    this.backend = 'supabase'
    this.canReset = false
  }

  async getAuthSession() {
    const { data, error } = await this.client.auth.getSession()
    raise(error)
    return data.session
  }

  onAuthStateChange(callback) {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => callback(session))
    return () => data.subscription.unsubscribe()
  }

  async signInAdmin({ email, password }) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password })
    raise(error)
    return data.session
  }

  async signOutAdmin() {
    const { error } = await this.client.auth.signOut()
    raise(error)
  }

  async getTasks() {
    const { data, error } = await this.client.from('tasks').select('*').order('created_at', { ascending: false })
    raise(error)
    return noRows(data).map(fromTask)
  }

  async getStudents() {
    const { data, error } = await this.client.from('students').select('*').order('created_at', { ascending: false })
    raise(error)
    return noRows(data).map(fromStudent)
  }

  async getApplications() {
    const { data, error } = await this.client.from('applications').select('*').order('created_at', { ascending: false })
    raise(error)
    return noRows(data).map(fromApplication)
  }

  async getTask(id) {
    const { data, error } = await this.client.from('tasks').select('*').eq('id', id).maybeSingle()
    raise(error)
    return data ? fromTask(data) : undefined
  }

  async createTask(task) {
    const { data, error } = await this.client.from('tasks').insert(toTask(task)).select('*').single()
    raise(error)
    return fromTask(data)
  }

  async createStudent(student) {
    const { data, error } = await this.client.from('students').insert(toStudent(student)).select('*').single()
    raise(error)
    return fromStudent(data)
  }

  async createApplication(application) {
    const { data, error } = await this.client.from('applications').insert(toApplication(application)).select('*').single()
    raise(error)
    return fromApplication(data)
  }

  async updateTaskStatus(id, status) {
    const { data, error } = await this.client
      .from('tasks')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single()
    raise(error)
    return fromTask(data)
  }

  async reset() {
    throw new Error('Supabase 後端不支援從公開前端重設資料。請到 Supabase 後台管理資料。')
  }
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { TASK_STATUSES, statusClass } from '../constants'
import { useData } from '../context/DataContext'

const tabs = [
  { id: 'tasks', label: '任務名單' },
  { id: 'students', label: '學生名單' },
  { id: 'applications', label: '報名紀錄' },
]

const formatDate = (value) => new Intl.DateTimeFormat('zh-TW', { month: 'numeric', day: 'numeric' }).format(new Date(value))

export function AdminPage() {
  const {
    applications,
    authLoading,
    backend,
    canReset,
    dataError,
    loading,
    resetData,
    session,
    signInAdmin,
    signOutAdmin,
    students,
    tasks,
    updateTaskStatus,
  } = useData()
  const [tab, setTab] = useState('tasks')
  const [query, setQuery] = useState('')
  const taskMap = useMemo(() => Object.fromEntries(tasks.map((task) => [task.id, task])), [tasks])
  const normalized = query.trim().toLowerCase()
  const filteredTasks = tasks.filter((item) => !normalized || `${item.title}${item.organization}${item.skills.join('')}`.toLowerCase().includes(normalized))
  const filteredStudents = students.filter((item) => !normalized || `${item.name}${item.school}${item.skills.join('')}`.toLowerCase().includes(normalized))
  const filteredApplications = applications.filter((item) => !normalized || `${item.studentName}${item.skill}${taskMap[item.taskId]?.title || ''}`.toLowerCase().includes(normalized))

  const handleReset = async () => {
    if (window.confirm('確定要清除目前輸入的資料，恢復成示範內容嗎？')) await resetData()
  }

  if (backend === 'supabase' && (authLoading || !session)) {
    return (
      <>
        <PageHero eyebrow="MVP 後台管理" title="管理資料前，先登入" description="後端版會把學生聯絡方式與報名紀錄保護在登入後台裡。公開訪客可以看任務與送出表單，但不能讀取所有個資。" aside={<div className="admin-stats"><span><strong>{tasks.length}</strong>公開任務</span><span><strong>Auth</strong>後台保護</span><span><strong>RLS</strong>資料權限</span></div>} />
        <section className="section admin-section">
          <div className="container">
            <AdminLogin loading={authLoading} onLogin={signInAdmin} />
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHero eyebrow="MVP 簡易管理" title="讓媒合進度保持清楚" description={backend === 'supabase' ? '你現在已登入後台。公開訪客只能新增資料；學生與報名聯絡方式只在管理頁顯示。' : '這裡暫時不需要登入，方便提案展示完整流程。正式上線前，請加入帳號權限、個資保護與審核機制。'} aside={<div className="admin-stats"><span><strong>{tasks.length}</strong>任務</span><span><strong>{students.length}</strong>學生</span><span><strong>{applications.length}</strong>報名</span></div>} />
      <section className="section admin-section">
        <div className="container">
          {dataError && <p className="form-error admin-message" role="alert">{dataError}</p>}
          <div className="backend-bar">
            <span>{backend === 'supabase' ? 'Supabase 後端模式' : 'localStorage 展示模式'}</span>
            {backend === 'supabase' && <button type="button" onClick={signOutAdmin}>登出管理員</button>}
          </div>
          <div className="admin-toolbar">
            <div className="admin-tabs" role="tablist">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setTab(item.id); setQuery('') }} key={item.id}>{item.label}<span>{item.id === 'tasks' ? tasks.length : item.id === 'students' ? students.length : applications.length}</span></button>)}</div>
            <div className="admin-actions"><label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋目前名單" /></label>{canReset && <button className="reset-button" type="button" onClick={handleReset}>重設示範資料</button>}</div>
          </div>

          {loading && <p className="admin-loading">資料讀取中…</p>}

          {tab === 'tasks' && <div className="admin-table-wrap"><table><thead><tr><th>任務</th><th>需要專長</th><th>形式</th><th>報名</th><th>狀態</th><th /></tr></thead><tbody>{filteredTasks.map((task) => <tr key={task.id}><td data-label="任務"><strong>{task.title}</strong><small>{task.organization}</small></td><td data-label="需要專長"><div className="tag-row">{task.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div></td><td data-label="形式">{task.mode}</td><td data-label="報名">{applications.filter((item) => item.taskId === task.id).length} 人</td><td data-label="狀態"><select className={`status-select ${statusClass(task.status)}`} value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)}>{TASK_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></td><td><Link to={`/tasks/${task.id}`} aria-label={`查看${task.title}`}>↗</Link></td></tr>)}</tbody></table>{!filteredTasks.length && <Empty />}</div>}

          {tab === 'students' && <div className="admin-table-wrap"><table><thead><tr><th>學生</th><th>身分／背景</th><th>專長</th><th>可投入時間</th><th>偏好</th><th>聯絡</th></tr></thead><tbody>{filteredStudents.map((student) => <tr key={student.id}><td data-label="學生"><strong>{student.name}</strong><small>{student.school}</small></td><td data-label="背景">{student.identity}<small>{student.background}</small></td><td data-label="專長"><div className="tag-row">{student.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div></td><td data-label="可投入時間">{student.availability}</td><td data-label="偏好"><span>{student.needsHours ? '需要時數' : '不需時數'}</span><small>{student.isPublic ? '願意公開' : '不公開'}</small></td><td data-label="聯絡"><span className="contact-cell">{student.contact}</span></td></tr>)}</tbody></table>{!filteredStudents.length && <Empty />}</div>}

          {tab === 'applications' && <div className="applications-grid">{filteredApplications.map((application) => <article className="application-card" key={application.id}><div className="application-head"><span className="avatar">{application.studentName.slice(0, 1)}</span><div><h3>{application.studentName}</h3><small>{formatDate(application.createdAt)} 送出</small></div><span className="skill-tag">{application.skill}</span></div><p>{application.reason}</p><div className="application-task"><small>報名任務</small><Link to={`/tasks/${application.taskId}`}>{taskMap[application.taskId]?.title || '任務已不存在'} ↗</Link></div><div className="application-contact"><span>聯絡方式</span><strong>{application.contact}</strong></div></article>)}{!filteredApplications.length && <Empty />}</div>}
        </div>
      </section>
    </>
  )
}

function Empty() {
  return <div className="admin-empty"><span>⌁</span><p>沒有符合搜尋條件的資料</p></div>
}

function AdminLogin({ loading, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await onLogin({ email, password })
    } catch (loginError) {
      setError(loginError.message || '登入失敗，請確認帳號密碼。')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <p className="eyebrow">Admin sign in</p>
      <h2>登入後台</h2>
      <p>請使用 Supabase Authentication 中建立的管理員帳號。登入後才能查看學生名單、聯絡方式與報名紀錄。</p>
      <label className="field">
        <span className="field-label">Email</span>
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" />
      </label>
      <label className="field">
        <span className="field-label">密碼</span>
        <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Supabase Auth 密碼" />
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary button-full" type="submit" disabled={loading || submitting}>{loading || submitting ? '登入中…' : '登入管理頁'}</button>
    </form>
  )
}

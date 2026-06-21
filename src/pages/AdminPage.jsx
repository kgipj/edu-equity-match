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
  const { tasks, students, applications, updateTaskStatus, resetData } = useData()
  const [tab, setTab] = useState('tasks')
  const [query, setQuery] = useState('')
  const taskMap = useMemo(() => Object.fromEntries(tasks.map((task) => [task.id, task])), [tasks])
  const normalized = query.trim().toLowerCase()
  const filteredTasks = tasks.filter((item) => !normalized || `${item.title}${item.organization}${item.skills.join('')}`.toLowerCase().includes(normalized))
  const filteredStudents = students.filter((item) => !normalized || `${item.name}${item.school}${item.skills.join('')}`.toLowerCase().includes(normalized))
  const filteredApplications = applications.filter((item) => !normalized || `${item.studentName}${item.skill}${taskMap[item.taskId]?.title || ''}`.toLowerCase().includes(normalized))

  const handleReset = () => {
    if (window.confirm('確定要清除目前輸入的資料，恢復成示範內容嗎？')) resetData()
  }

  return (
    <>
      <PageHero eyebrow="MVP 簡易管理" title="讓媒合進度保持清楚" description="這裡暫時不需要登入，方便提案展示完整流程。正式上線前，請加入帳號權限、個資保護與審核機制。" aside={<div className="admin-stats"><span><strong>{tasks.length}</strong>任務</span><span><strong>{students.length}</strong>學生</span><span><strong>{applications.length}</strong>報名</span></div>} />
      <section className="section admin-section">
        <div className="container">
          <div className="admin-toolbar">
            <div className="admin-tabs" role="tablist">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setTab(item.id); setQuery('') }} key={item.id}>{item.label}<span>{item.id === 'tasks' ? tasks.length : item.id === 'students' ? students.length : applications.length}</span></button>)}</div>
            <div className="admin-actions"><label className="search-box"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋目前名單" /></label><button className="reset-button" type="button" onClick={handleReset}>重設示範資料</button></div>
          </div>

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

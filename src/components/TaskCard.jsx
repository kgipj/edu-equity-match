import { Link } from 'react-router-dom'
import { statusClass } from '../constants'

export function TaskCard({ task, featured = false }) {
  return (
    <article className={`task-card ${featured ? 'task-card-featured' : ''}`}>
      <div className="task-card-top">
        <span className={`status-pill ${statusClass(task.status)}`}><i />{task.status}</span>
        <span className="task-mode">{task.mode}</span>
      </div>
      <div>
        <p className="eyebrow small">{task.organization}</p>
        <h3>{task.title}</h3>
        <p className="task-summary">{task.summary}</p>
      </div>
      <div className="tag-row">
        {task.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}
      </div>
      <div className="task-meta">
        <span><b>◷</b>{task.time}</span>
        <span><b>◉</b>{task.volunteerHours ? '可提供服務時數' : '專案經驗累積'}</span>
      </div>
      <Link className="card-link" to={`/tasks/${task.id}`} aria-label={`查看${task.title}詳情`}>
        查看任務 <span>↗</span>
      </Link>
    </article>
  )
}

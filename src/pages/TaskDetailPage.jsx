import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Field, PrivacyConsent, SuccessPanel } from '../components/FormFields'
import { TaskCard } from '../components/TaskCard'
import { statusClass } from '../constants'
import { useData } from '../context/DataContext'

const initialApplication = { studentName: '', contact: '', skill: '', reason: '', privacyConsent: false }

export function TaskDetailPage() {
  const { taskId } = useParams()
  const { backend, createApplication, getTask, loading, tasks } = useData()
  const task = getTask(taskId)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState(initialApplication)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const related = useMemo(() => task ? tasks.filter((item) => item.id !== task.id && item.skills.some((skill) => task.skills.includes(skill))).slice(0, 2) : [], [task, tasks])
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  if (!task && loading) return <section className="not-found container"><span>讀取中</span><h1>正在載入任務資料</h1><p>後端資料庫回應中，請稍等一下。</p></section>
  if (!task) return <section className="not-found container"><span>找不到任務</span><h1>這個任務可能已經移除</h1><Link className="button button-primary" to="/tasks">回任務列表</Link></section>

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!form.privacyConsent) { setError('請先勾選個人資料蒐集、處理及利用告知事項。'); return }
    setSaving(true)
    try {
      await createApplication({ ...form, taskId: task.id })
      setSubmitted(true)
    } catch (submitError) {
      setError(submitError.message || '報名失敗，請稍後再試。')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <section className="detail-hero">
        <div className="container">
          <Link className="back-link" to="/tasks">← 回到任務列表</Link>
          <div className="detail-heading">
            <div>
              <div className="detail-pills"><span className={`status-pill ${statusClass(task.status)}`}><i />{task.status}</span><span className="task-mode">{task.mode}</span></div>
              <p className="eyebrow">{task.organization}</p>
              <h1>{task.title}</h1>
              <p className="lead">{task.summary}</p>
            </div>
            <div className="detail-action-card">
              <small>這項任務需要</small><div className="tag-row">{task.skills.map((skill) => <span className="skill-tag" key={skill}>{skill}</span>)}</div>
              {task.status === '招募中' ? <button className="button button-primary button-full" type="button" onClick={() => { setShowForm(true); setTimeout(() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' }), 0) }}>我想參與 <span>→</span></button> : <button className="button button-disabled button-full" disabled>目前{task.status}</button>}
              <p>報名不代表立即媒合，單位會再與你確認合作方式。</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section detail-section">
        <div className="container detail-grid">
          <article className="detail-content">
            <section><p className="eyebrow">任務說明</p><h2>一起完成什麼？</h2><p>{task.details}</p></section>
            <section><p className="eyebrow">任務資訊</p><h2>合作前先知道</h2><dl className="detail-list"><div><dt>◷ 預計時間</dt><dd>{task.time}</dd></div><div><dt>⌖ 參與形式</dt><dd>{task.mode}{task.location ? `・${task.location}` : ''}</dd></div><div><dt>◉ 服務時數</dt><dd>{task.volunteerHours ? '單位可核發志工服務時數' : '本任務不提供時數，以專案經驗與成果回饋為主'}</dd></div><div><dt>✉ 聯絡窗口</dt><dd>{task.contact}</dd></div></dl></section>
            <section className="boundary-box"><span>守護專業的距離</span><div><h3>青年夥伴不會被要求獨自承擔教育現場工作</h3><p>任務應由發布單位提供素材、脈絡與窗口。若涉及兒少資料或影像，必須先完成授權、去識別化與必要的保護流程。</p></div></section>
          </article>
          <aside className="organization-card"><div className="organization-mark">教</div><small>任務發布單位</small><h3>{task.organization}</h3><p>以實際行動回應教育現場需求，邀請青年用跨域能力一起參與。</p><span>✓ 已提供聯絡窗口</span><span>✓ 任務範圍已說明</span></aside>
        </div>
      </section>

      {showForm && task.status === '招募中' && <section id="apply" className="section apply-section"><div className="container apply-wrap">
        {submitted ? <SuccessPanel title="報名資料已送出！" action={<div className="success-actions"><Link className="button button-primary" to="/tasks">繼續探索任務</Link><button className="button button-ghost" type="button" onClick={() => { setForm(initialApplication); setSubmitted(false); setShowForm(false) }}>關閉</button></div>}>{backend === 'supabase' ? '報名已送到雲端後端。管理者登入後可以查看這筆紀錄。' : '資料已保存在這台裝置。合作單位可以在簡易管理頁查看這筆報名。'}</SuccessPanel> : <>
          <div className="apply-intro"><p className="eyebrow">報名任務</p><h2>讓單位認識你</h2><p>不用寫正式履歷。說清楚你的能力與想參與的原因，就是最好的開始。</p><button type="button" onClick={() => setShowForm(false)}>暫時不填 ×</button></div>
          <form className="apply-form" onSubmit={submit}>
            <div className="form-grid">
              <Field label="姓名／暱稱" required><input required value={form.studentName} onChange={(e) => set('studentName', e.target.value)} /></Field>
              <Field label="聯絡方式" required><input required value={form.contact} onChange={(e) => set('contact', e.target.value)} /></Field>
              <Field label="最相關的專長" required full><select required value={form.skill} onChange={(e) => set('skill', e.target.value)}><option value="" disabled>請選擇</option>{task.skills.map((skill) => <option key={skill}>{skill}</option>)}<option>其他相關能力</option></select></Field>
              <Field label="想參與的原因" required full><textarea required rows="5" value={form.reason} onChange={(e) => set('reason', e.target.value)} placeholder="你為什麼對這項任務有興趣？希望帶來什麼或學到什麼？" /></Field>
              <PrivacyConsent checked={form.privacyConsent} onChange={(value) => { set('privacyConsent', value); setError('') }} />
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button button-primary button-full" type="submit" disabled={saving}>{saving ? '送出中…' : '送出報名'} <span>→</span></button>
          </form>
        </>}
      </div></section>}

      {!!related.length && <section className="section related-section"><div className="container"><div className="section-heading split-heading"><div><p className="eyebrow">也許也適合你</p><h2>相近專長的任務</h2></div></div><div className="task-grid related-grid">{related.map((item) => <TaskCard task={item} key={item.id} />)}</div></div></section>}
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, RadioCards, SkillPicker, SuccessPanel } from '../components/FormFields'
import { PageHero } from '../components/PageHero'
import { TASK_MODES, TASK_STATUSES } from '../constants'
import { useData } from '../context/DataContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const initialForm = {
  title: '', organization: '', summary: '', details: '', skills: [], mode: '線上',
  time: '', volunteerHours: false, contact: '', status: '招募中', location: '',
}

export function TaskFormPage() {
  useDocumentTitle('發布任務')
  const { createTask } = useData()
  const [form, setForm] = useState(initialForm)
  const [created, setCreated] = useState(null)
  const [error, setError] = useState('')
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    if (!form.skills.length) { setError('請至少選擇一項需要的專長。'); return }
    setCreated(createTask(form))
  }

  if (created) return <div className="form-success-wrap container"><SuccessPanel title="任務已發布！" action={<div className="success-actions"><Link className="button button-primary" to={`/tasks/${created.id}`}>查看任務頁</Link><button className="button button-ghost" type="button" onClick={() => { setForm(initialForm); setCreated(null) }}>再發布一項</button></div>}>青年現在可以在任務列表看到這項需求。記得安排清楚的合作窗口與回饋節點。</SuccessPanel></div>

  return (
    <>
      <PageHero eyebrow="發布教育任務" title="把需要說清楚，讓專長接得上" description="一個好任務有明確成果、合理時間與固定窗口。青年不只是幫手，而是一起完成影響力的合作夥伴。" aside={<div className="safe-aside"><strong>任務安全原則</strong><span>✓ 不讓未受訓青年獨自接觸兒少</span><span>✓ 不公開個資或未授權素材</span><span>✓ 提供清楚窗口與工作回饋</span></div>} />
      <section className="section form-section">
        <div className="container form-layout">
          <aside className="form-sidebar"><div className="sidebar-sticky"><p className="eyebrow">好任務檢查</p><ul className="check-list"><li>有一個可交付成果</li><li>專長需求具體</li><li>時間範圍合理</li><li>聯絡窗口清楚</li></ul><div className="privacy-note"><strong>先求小而可完成</strong><p>MVP 階段建議把大型專案拆成 4－12 小時的明確任務。</p></div></div></aside>
          <form className="main-form" onSubmit={submit}>
            <div className="form-card">
              <div className="form-card-heading"><span>01</span><div><h2>任務基本資訊</h2><p>先讓青年一眼知道：為誰、要做什麼、為何重要。</p></div></div>
              <div className="form-grid">
                <Field label="任務名稱" required full><input required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="例如：教育現場故事圖卡設計" /></Field>
                <Field label="發布單位" required><input required value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="組織／學校／教師社群名稱" /></Field>
                <Field label="任務狀態" required><select value={form.status} onChange={(e) => set('status', e.target.value)}>{TASK_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></Field>
                <Field label="任務短介" required full hint="建議 50－100 字，會顯示在任務卡片上。"><textarea required rows="3" value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="說明這項任務會帶來什麼改變…" /></Field>
                <Field label="完整任務說明" required full hint="包含預期成果、已有素材、合作流程與任務邊界。"><textarea required rows="6" value={form.details} onChange={(e) => set('details', e.target.value)} placeholder="讓青年能在報名前判斷自己是否適合…" /></Field>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-heading"><span>02</span><div><h2>需要的專長</h2><p>請選真正必要的能力，避免把一個任務包成一人公司。</p></div></div>
              <SkillPicker value={form.skills} onChange={(value) => { set('skills', value); setError('') }} required />
              {error && <p className="form-error" role="alert">{error}</p>}
            </div>
            <div className="form-card">
              <div className="form-card-heading"><span>03</span><div><h2>參與方式與聯絡</h2><p>資訊越透明，雙方越容易建立好的合作期待。</p></div></div>
              <div className="form-grid">
                <Field label="任務形式" required full><RadioCards name="mode" options={TASK_MODES} value={form.mode} onChange={(value) => set('mode', value)} /></Field>
                <Field label="預計服務時間" required><input required value={form.time} onChange={(e) => set('time', e.target.value)} placeholder="例如：7/01－7/14，共約 8 小時" /></Field>
                <Field label="實體地點"><input value={form.location} onChange={(e) => set('location', e.target.value)} placeholder={form.mode === '線上' ? '不限地區' : '縣市與區域'} /></Field>
                <Field label="聯絡方式" required full><input required value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="Email、電話或其他公務聯絡方式" /></Field>
                <label className="switch-row field-full"><div><strong>提供志工服務時數</strong><small>請確認單位有能力核實並開立證明。</small></div><input type="checkbox" checked={form.volunteerHours} onChange={(e) => set('volunteerHours', e.target.checked)} /><span className="switch" /></label>
              </div>
            </div>
            <div className="submit-row"><p>送出後仍可在簡易管理頁切換任務狀態。</p><button className="button button-primary" type="submit">發布這項任務 <span>→</span></button></div>
          </form>
        </div>
      </section>
    </>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, RadioCards, SkillPicker, SuccessPanel } from '../components/FormFields'
import { PageHero } from '../components/PageHero'
import { useData } from '../context/DataContext'

const initialForm = {
  name: '', school: '', identity: '大學生', background: '', skills: [], bio: '',
  availability: '', contact: '', needsHours: false, isPublic: true,
}

export function StudentFormPage() {
  const { createStudent } = useData()
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.skills.length) { setError('請至少選擇一項可提供的協助類型。'); return }
    createStudent(form)
    setSubmitted(true)
  }

  if (submitted) return <div className="form-success-wrap container"><SuccessPanel title="你的專長已登錄！" action={<div className="success-actions"><Link className="button button-primary" to="/tasks">探索適合的任務</Link><button className="button button-ghost" type="button" onClick={() => { setForm(initialForm); setSubmitted(false) }}>再登錄一位</button></div>}>平台已把你的資料保存在這台裝置。接下來，找一個讓能力真正被需要的任務吧。</SuccessPanel></div>

  return (
    <>
      <PageHero eyebrow="學生專長登錄" title="先從你已經會的事開始" description="不需要是教育系，也不需要有完整作品集。告訴我們你的能力與時間，讓合適的教育行動找到你。" aside={<div className="quote-aside">「你的專長，就是推動教育平權的最強外掛。」<small>— TFT 題目解題提醒</small></div>} />
      <section className="section form-section">
        <div className="container form-layout">
          <aside className="form-sidebar">
            <div className="sidebar-sticky">
              <p className="eyebrow">登錄流程</p>
              <ol><li className="active"><span>1</span>基本資料</li><li className="active"><span>2</span>專長與時間</li><li className="active"><span>3</span>參與偏好</li></ol>
              <div className="privacy-note"><strong>隱私提醒</strong><p>聯絡方式只會出現在本機管理頁，不會顯示在公開任務頁。</p></div>
            </div>
          </aside>
          <form className="main-form" onSubmit={handleSubmit}>
            <div className="form-card">
              <div className="form-card-heading"><span>01</span><div><h2>認識你</h2><p>讓合作單位知道怎麼稱呼你與你的學習背景。</p></div></div>
              <div className="form-grid">
                <Field label="姓名／暱稱" required><input required value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="例如：小禾" /></Field>
                <Field label="學校" required><input required value={form.school} onChange={(e) => set('school', e.target.value)} placeholder="例如：○○高中／大學" /></Field>
                <Field label="目前身分" required full><RadioCards name="identity" options={['高中生', '大學生']} value={form.identity} onChange={(value) => set('identity', value)} /></Field>
                <Field label="科系或專長背景" required full><input required value={form.background} onChange={(e) => set('background', e.target.value)} placeholder="不限定科系，也可以填社團、軟體工具或自學經驗" /></Field>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-heading"><span>02</span><div><h2>你的能力與時間</h2><p>選擇你想貢獻的方式，可以跨出原本的科系標籤。</p></div></div>
              <SkillPicker value={form.skills} onChange={(value) => { set('skills', value); setError('') }} required />
              {error && <p className="form-error" role="alert">{error}</p>}
              <div className="form-grid form-grid-spaced">
                <Field label="自我介紹" required full hint="可說說你做過什麼、想學什麼，或為何關心教育平權。"><textarea required rows="5" value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="用 2－4 句話介紹自己…" /></Field>
                <Field label="可投入時間" required full><input required value={form.availability} onChange={(e) => set('availability', e.target.value)} placeholder="例如：7－8 月，每週 3 小時；平日晚間" /></Field>
              </div>
            </div>
            <div className="form-card">
              <div className="form-card-heading"><span>03</span><div><h2>聯絡與參與偏好</h2><p>完成後，你可以直接探索並報名平台任務。</p></div></div>
              <div className="form-grid">
                <Field label="聯絡方式" required full hint="Email、電話或 LINE ID 皆可，請填寫可實際聯絡到你的方式。"><input required value={form.contact} onChange={(e) => set('contact', e.target.value)} placeholder="例如：hello@example.com" /></Field>
                <label className="switch-row field-full"><div><strong>我需要志工服務時數</strong><small>這只是媒合偏好，不會影響參與資格。</small></div><input type="checkbox" checked={form.needsHours} onChange={(e) => set('needsHours', e.target.checked)} /><span className="switch" /></label>
                <Field label="是否願意公開專長卡片" required full><RadioCards name="isPublic" options={['願意公開', '暫不公開']} value={form.isPublic ? '願意公開' : '暫不公開'} onChange={(value) => set('isPublic', value === '願意公開')} /></Field>
              </div>
            </div>
            <div className="submit-row"><p>送出即表示你理解：本 MVP 資料只保存在目前瀏覽器。</p><button className="button button-primary" type="submit">完成專長登錄 <span>→</span></button></div>
          </form>
        </div>
      </section>
    </>
  )
}

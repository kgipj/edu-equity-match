import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { TaskCard } from '../components/TaskCard'
import { SKILLS, TASK_MODES } from '../constants'
import { useData } from '../context/DataContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function TasksPage() {
  useDocumentTitle('探索任務')
  const { tasks } = useData()
  const [params, setParams] = useSearchParams()
  const skill = params.get('skill') || '全部專長'
  const mode = params.get('mode') || '全部形式'
  const status = params.get('status') || '招募中'

  const update = (key, value, emptyValue) => {
    const next = new URLSearchParams(params)
    if (value === emptyValue) next.delete(key); else next.set(key, value)
    setParams(next)
  }

  const filtered = useMemo(() => tasks.filter((task) => {
    const skillMatch = skill === '全部專長' || task.skills.includes(skill)
    const modeMatch = mode === '全部形式' || task.mode === mode
    const statusMatch = status === '全部狀態' || task.status === status
    return skillMatch && modeMatch && statusMatch
  }), [tasks, skill, mode, status])

  return (
    <>
      <PageHero eyebrow="探索任務" title="找到讓專長發揮的地方" description="從一次設計、一份資料或一場活動開始。選擇適合你的形式，和教育行動者一起把好事做得更完整。" aside={<><strong>{tasks.filter((item) => item.status === '招募中').length}</strong><span>個任務正在招募青年夥伴</span></>} />
      <section className="section task-list-section">
        <div className="container">
          <div className="filters" aria-label="任務篩選">
            <label><span>專長類型</span><select value={skill} onChange={(event) => update('skill', event.target.value, '全部專長')}><option>全部專長</option>{SKILLS.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label><span>參與形式</span><select value={mode} onChange={(event) => update('mode', event.target.value, '全部形式')}><option>全部形式</option>{TASK_MODES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>任務狀態</span><select value={status} onChange={(event) => update('status', event.target.value, '招募中')}><option>招募中</option><option>已媒合</option><option>已結束</option><option>全部狀態</option></select></label>
            <button type="button" onClick={() => setParams({})}>清除篩選</button>
          </div>
          <div className="results-bar"><p><strong>{filtered.length}</strong> 個符合條件的任務</p><span>資料會保存在這台裝置的瀏覽器中</span></div>
          {filtered.length ? <div className="task-grid task-grid-list">{filtered.map((task) => <TaskCard task={task} key={task.id} />)}</div> : <div className="empty-state"><span>⌁</span><h2>目前沒有符合的任務</h2><p>換一個專長或參與形式看看，也可以稍後再回來。</p><button className="button button-primary" type="button" onClick={() => setParams({})}>顯示招募中任務</button></div>}
        </div>
      </section>
    </>
  )
}

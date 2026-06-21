import { Link } from 'react-router-dom'
import { SKILLS } from '../constants'
import { useData } from '../context/DataContext'
import { TaskCard } from '../components/TaskCard'

export function HomePage() {
  const { tasks } = useData()
  const recentTasks = tasks.filter((task) => task.status === '招募中').slice(0, 3)

  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker"><span>✦</span> 你的專長，能讓教育多一種可能</div>
            <h1>不一定要當老師，<br />也能參與<span>教育平權。</span></h1>
            <p>設計、剪輯、社群、資料、程式——每一種能力，都可能正是教育現場需要的那一塊。從一個適合你的任務開始，把關心變成真實行動。</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/students/new">我是想幫忙的學生 <span>→</span></Link>
              <Link className="button button-secondary" to="/tasks/new">我是需要協助的單位 <span>↗</span></Link>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack"><span>禾</span><span>宇</span><span>庭</span><span>＋</span></div>
              <p><strong>不是教育系，也完全沒關係。</strong><br />從你已經會的事開始。</p>
            </div>
          </div>
          <div className="hero-visual" aria-label="學生專長與教育任務媒合示意圖">
            <div className="visual-dots" />
            <div className="match-line line-one" /><div className="match-line line-two" />
            <div className="profile-card">
              <div className="profile-photo">妤</div>
              <div><small>我的專長</small><strong>視覺設計</strong><span>大學生・台中</span></div>
              <span className="profile-check">✓</span>
            </div>
            <div className="match-badge"><span>✦</span><strong>媒合成功</strong><small>找到能發揮的任務</small></div>
            <div className="mini-task-card">
              <span className="status-pill status-open"><i />招募中</span>
              <small>偏鄉教育行動聯盟</small>
              <strong>教育現場故事<br />圖卡設計</strong>
              <div><span>視覺設計</span><span>社群企劃</span></div>
            </div>
            <div className="floating-label label-design">✦ 設計</div>
            <div className="floating-label label-code">&lt;/&gt; 網站</div>
            <div className="floating-label label-video">▶ 剪輯</div>
          </div>
        </div>
        <div className="container hero-note"><span>↓</span><p><b>教育平權，是讓每個孩子不因出生地與家庭背景，被限制學習與發展的可能。</b> 這不是少數教育工作者的功課，而是每個專業都能一起解的問題。</p></div>
      </section>

      <section className="section skill-section">
        <div className="container">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">你已經擁有參與的起點</p><h2>你的專長，可以這樣加入</h2></div>
            <p>教育平權需要不同視角。看看哪一種能力，最像現在的你。</p>
          </div>
          <div className="skill-grid">
            {SKILLS.slice(0, 8).map((skill, index) => (
              <Link className={`skill-card skill-color-${(index % 4) + 1}`} to={`/tasks?skill=${encodeURIComponent(skill.name)}`} key={skill.name}>
                <span className="skill-card-icon">{skill.icon}</span>
                <div><strong>{skill.name}</strong><small>{skill.description}</small></div>
                <span className="skill-arrow">↗</span>
              </Link>
            ))}
          </div>
          <div className="center-link"><Link to="/tasks">探索所有專長任務 <span>→</span></Link></div>
        </div>
      </section>

      <section className="section tasks-preview">
        <div className="container">
          <div className="section-heading split-heading align-end">
            <div><p className="eyebrow">近期任務</p><h2>現在，就有地方需要你</h2></div>
            <Link className="text-link" to="/tasks">查看全部任務 <span>→</span></Link>
          </div>
          <div className="task-grid">
            {recentTasks.map((task, index) => <TaskCard task={task} featured={index === 0} key={task.id} />)}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container how-grid">
          <div className="how-copy">
            <p className="eyebrow">把關心走成一條路</p>
            <h2>三步，開始你的影響力</h2>
            <p>不用先成為專家。平台幫你找到合適、界線清楚的任務，合作單位則提供必要脈絡與回饋。</p>
            <Link className="button button-primary" to="/students/new">登錄我的專長 <span>→</span></Link>
          </div>
          <ol className="steps-list">
            <li><span>01</span><div><strong>告訴我們你會什麼</strong><p>登錄專長、可投入時間與你在意的合作方式。</p></div></li>
            <li><span>02</span><div><strong>找到適合的真實任務</strong><p>依專長與參與形式篩選，不讓熱情卡在資訊落差。</p></div></li>
            <li><span>03</span><div><strong>和教育行動者一起完成</strong><p>在清楚的任務範圍內貢獻能力，累積作品與理解。</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section principle-section">
        <div className="container principle-card">
          <div className="principle-art"><div className="circle c1" /><div className="circle c2" /><span>專業<br />有邊界</span></div>
          <div>
            <p className="eyebrow">守護專業的距離</p>
            <h2>參與，不等於獨自承擔</h2>
            <p>青年任務聚焦在倡議、設計、資料、活動與組織支援；需要長期陪伴或直接接觸兒少的工作，應由具備制度與專業支持的組織帶領。</p>
          </div>
          <div className="principle-points"><span>✓ 任務界線清楚</span><span>✓ 組織提供窗口</span><span>✓ 尊重隱私與授權</span></div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container cta-card">
          <div><p className="eyebrow light">你的能力，值得被需要</p><h2>準備好用專長，<br />讓教育多一種可能了嗎？</h2></div>
          <div className="cta-actions"><Link className="button button-light" to="/students/new">登錄我的專長 <span>→</span></Link><Link to="/tasks">先看看有哪些任務</Link></div>
        </div>
      </section>
    </>
  )
}

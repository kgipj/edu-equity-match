import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/tasks', label: '探索任務' },
  { to: '/students/new', label: '登錄專長' },
  { to: '/tasks/new', label: '發布任務' },
  { to: '/admin', label: '管理頁' },
]

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-wrap">
          <Link className="brand" to="/" onClick={() => setMenuOpen(false)} aria-label="共學力首頁">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
            <span><strong>共學力</strong><small>青年專長 × 教育平權</small></span>
          </Link>
          <button className="menu-button" type="button" aria-label="切換導覽選單" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主要導覽">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>
            ))}
            <Link className="nav-cta" to="/tasks" onClick={() => setMenuOpen(false)}>找到我的任務 <span>→</span></Link>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">共學力</div>
            <p>讓青年不只關心，更能用自己的專長參與教育平權。</p>
          </div>
          <div className="footer-links">
            <div><strong>開始參與</strong><Link to="/tasks">探索任務</Link><Link to="/students/new">登錄專長</Link></div>
            <div><strong>合作單位</strong><Link to="/tasks/new">發布任務</Link><Link to="/admin">管理資料</Link></div>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>Impact Star 2026 MVP Prototype</span>
          <span>資料僅儲存在此瀏覽器</span>
        </div>
      </footer>
    </div>
  )
}

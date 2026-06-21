import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <section className="not-found container"><span>404</span><h1>這條路還沒鋪好</h1><p>頁面不存在，回首頁找一個能發揮的起點吧。</p><Link className="button button-primary" to="/">回到首頁</Link></section>
}

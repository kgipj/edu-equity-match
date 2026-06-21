import { Component } from 'react'

/**
 * 全站錯誤邊界：攔截 render 階段的未預期錯誤，避免整個 App 崩成白畫面。
 * 最常見成因是本機 localStorage 資料毀損或儲存空間不足，因此提供「清除本機資料」逃生口。
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // 保留錯誤資訊以利除錯；正式環境可在此接上錯誤回報服務（Sentry 等）。
    console.error('App crashed:', error, info)
  }

  handleClearData = () => {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith('edu_equity_'))
        .forEach((key) => window.localStorage.removeItem(key))
    } catch {
      // localStorage 不可用時無需、也無法清除，直接重新整理即可。
    }
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <section className="not-found container" role="alert">
        <span>發生未預期的錯誤</span>
        <h1>頁面暫時無法顯示</h1>
        <p>可能是本機暫存資料毀損或瀏覽器儲存空間不足。你可以重新整理，或清除本機示範資料後再試。</p>
        <div className="success-actions">
          <button className="button button-primary" type="button" onClick={() => window.location.reload()}>重新整理</button>
          <button className="button button-ghost" type="button" onClick={this.handleClearData}>清除本機資料並重試</button>
        </div>
      </section>
    )
  }
}

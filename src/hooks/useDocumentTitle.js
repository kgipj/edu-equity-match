import { useEffect } from 'react'

const BRAND = '共學力｜教育平權青年專長媒合平台'

/**
 * 在 SPA 換頁時同步更新 document.title。
 * 傳入頁面標題會組成「<頁面>｜共學力」；不傳則回到完整品牌標題（首頁用）。
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title}｜共學力` : BRAND
  }, [title])
}

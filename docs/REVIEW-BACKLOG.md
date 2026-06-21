# 對抗式審查 — 缺陷追蹤 Backlog

> 來源：2026-06-22 對全專案的 ultrathink 對抗式審查。
> 工作協議：所有實作走 **TDD（Red-Green-Refactor）** + **Boy Scout Rule** + **Small CLs**，每個 commit 帶 `Co-authored-by: kgipj`。
> 狀態圖例：✅ 已於 review-round-1 修復　｜　⬜ 待辦

---

## 🔴 高 — 真實當機風險 / 對產品目標傷害大

### ✅ D1 — localStorage 容錯與全站錯誤邊界
- 問題：`repository.read()` 的 `JSON.parse` 無 try/catch；無 Error Boundary；無痕／停用儲存／容量已滿會白屏。
- 修復：`ErrorBoundary` + `repository` try/catch + `MemoryStorage` 退路 + 探針 `resolveStorage()`。
- 測試：`repository.test.js` 新增「毀損 JSON 回退空陣列」「拒絕寫入不丟例外」。

### ✅ D2 — `formatDate` 對非法日期丟 `RangeError`
- 修復：抽出 `src/utils/formatDate.js`，非法值回傳 `—`；附單元測試。

### ✅ D3 — SPA 換頁 `<title>` 不更新
- 修復：`useDocumentTitle` hook，7 個頁面接上。

### ✅ D4 — 無社群分享預覽（Open Graph）
- 修復：`index.html` 補 OG / Twitter / canonical meta。
- ⬜ **O1（子項）**：分享圖 `public/og-cover.png`（1200×630，PNG/JPG）尚缺素材；`index.html` 已留 TODO 與標籤。

### ⬜ O2 — 無障礙：裝飾性 icon 未 `aria-hidden`
- 影響：報讀軟體逐字念出 ✦▶◷◉ 等符號。
- 驗收：`TaskCard`、`constants` icon、status pill `<i>`、各 emoji 裝飾加 `aria-hidden="true"`；以 RTL 斷言可存取名稱不含裝飾字元。

### ⬜ O3 — 無障礙：過小字體（8–10px）
- 驗收：盤點 `styles.css` 所有 `font-size: 8/9/10px`，提升至可讀下限（建議內文 ≥12px、輔助 ≥11px），並複查版面未破。

### ⬜ O4 — 無障礙：換頁缺焦點管理
- 問題：`ScrollToTop` 只捲動，鍵盤／報讀使用者換頁後焦點遺失。
- 驗收：換頁將焦點移至主內容或 `<h1>`；加上 skip-link。

### ⬜ O5 — 無障礙：AdminPage ARIA tabs 不完整
- 驗收：補 `role="tabpanel"`/`aria-controls`/方向鍵切換，或退成單純 button。

### ⬜ O6 — 無障礙：色彩對比 WCAG AA 稽核
- 驗收：`--muted` 等組合量測對比，未達 4.5:1（大字 3:1）者調整。

---

## 🟠 中 — 維運痛點 / 潛在 bug / 架構債

### ✅ D6 — base path 只在 CI 設定（Windows Git Bash 會路徑轉換）
- 修復：`base` 改用 `BASE_PATH` env（`vite.config.js`）；workflow 改用 env；`eslint.config.js` 給設定檔 Node globals。

### ✅ D7 — README/工具鏈不一致、缺 Node 版本治理
- 修復：README 改 pnpm；加 `.nvmrc`、`package.json` `engines`、Dockerfile/compose、WSL2 說明。

### ⬜ O7 — `DataContext` 每次 render 全量 clone、value 未 memo
- 問題：`getTasks/getStudents/getApplications` 每 render `JSON.parse(JSON.stringify)`；context value 未 memo → 全 consumer re-render。
- 驗收：以 revision 為 key 的 `useMemo` 計算一次；context value 用 `useMemo`/穩定參考；加測試斷言同一 revision 不重算。

### ⬜ O8 — Magic string：狀態/形式字面值散落多檔
- 問題：`'招募中'` 等同時當顯示與邏輯 key，散在 `HomePage`、`TasksPage`、`seed`。
- 驗收：抽進 `constants.js`（如 `TASK_STATUS.OPEN`）；改字不再無聲打破 filter。

### ⬜ O9 — 死欄位 `isPublic` / `needsHours` 收集卻未使用
- 驗收：二擇一 — 實作公開學生名片頁（用 `isPublic`），或移除欄位避免誤導。先開 issue 討論產品方向。

### ⬜ O10 — 測試覆蓋過低 + 缺元件測試基建
- 現況：僅 repository 單元測試。
- 驗收：導入 `@testing-library/react` + `jsdom`（vitest `environment: jsdom`）；補 `ErrorBoundary`（子元件丟錯→fallback）、`useDocumentTitle`、`TasksPage` 篩選、表單驗證等測試。**這是讓其餘元件項目能走 TDD 的前置基建，優先做。**

### ⬜ O11 — 表單僅 HTML `required`，可送純空白／無格式驗證
- 驗收：送出前 `trim`、擋純空白、email/聯絡格式檢查；純函式 validator + 單元測試。

### ⬜ O19 — localStorage 無 schema migration
- 問題：key 有 `_v1` 但無遷移；改結構會讓舊使用者資料壞掉。
- 驗收：讀取時版本偵測 + migration 函式 + 測試。

---

## 🟡 低 — 體質 / 打磨

- ✅ D8 — `eslint.config.js` 設定檔 Node globals（驗證時順手修）。
- ⬜ O12 — 字型改自架或 `<link rel=preconnect>`，取代 CSS `@import`（render-blocking + IP 外洩 Google）。
- ⬜ O13 — 多分頁同步：監聽 `storage` 事件。
- ⬜ O14 — 補 `LICENSE`。
- ⬜ O15 — 補專案 `CLAUDE.md`（維運用）。
- ⬜ O16 — `robots.txt` / `sitemap.xml` / PWA `manifest`。
- ⬜ O17 — 導入 TypeScript 或 PropTypes。
- ⬜ O18 — 過長單行 JSX（`AdminPage`/`TasksPage`/`TaskDetailPage`）拆解。
- ⬜ O20 — PR 觸發 CI（lint/test）+ Dependabot/Renovate。

---

## 🔒 上線前必備（已知，README 已聲明；視為 epic）

- ⬜ S1 — 帳號驗證 + 角色權限（admin 目前全開放）。
- ⬜ S2 — 個資告知與同意流程；PII 不再明文存 localStorage。
- ⬜ S3 — 內容審核、檢舉與下架機制。
- ⬜ S4 — 兒少／影像／訪談資料的授權與去識別化流程。

# 共學力｜教育平權青年專長媒合平台 MVP

一個可直接執行的前端 MVP，回應 2026 Impact Star 青年影響力啟動賽 TFT「為台灣而教」題目：讓高中生、大學生理解教育平權，並把關注轉化成實際參與。

這不是志工時數管理系統。平台核心是讓非教育科系青年發現，設計、剪輯、社群、翻譯、資料整理、活動支援、網站等能力，同樣能參與教育平權。

## 已完成功能

- 首頁：平台宗旨、學生／單位雙入口、近期任務、專長類型與參與原則
- 學生專長登錄：完整欄位、專長複選、公開與服務時數偏好
- 任務發布：任務內容、專長、形式、時間、服務時數、聯絡方式與狀態
- 任務列表：依專長、參與形式與任務狀態篩選
- 任務詳情與報名：完整資訊、任務邊界提醒、青年報名表
- 簡易管理：學生、任務、報名紀錄；可直接切換任務狀態
- localStorage 資料持久化與預設示範資料
- 桌機、平板、手機 RWD

## 技術架構

- React + Vite
- React Router
- localStorage repository adapter
- Vitest
- 純 CSS，沒有 UI framework

資料讀寫集中在 `src/data/repository.js`。未來串接 Supabase 或 Firebase 時，可新增相同介面的 adapter，保留頁面與元件邏輯。

## 安裝與啟動

需要 Node.js 20.19 以上版本（CI 與 `.nvmrc` 使用 Node 22），套件管理器為 pnpm。

```bash
pnpm install
pnpm dev
```

瀏覽器開啟 <http://localhost:5173>。

### 用 WSL2 / Docker 開發（建議）

本專案的 CI 與部署環境是 Linux（ubuntu）。在 Windows 上建議於 **WSL2** 內開發，並把專案放在 Linux 檔案系統（如 `~/projects/…`）以獲得正常的 HMR 與效能。或直接用 Docker 取得對齊 CI 的環境：

```bash
docker compose up   # http://localhost:5173
```

## 測試與正式建置

```bash
# 資料層測試
pnpm test

# 程式碼檢查
pnpm lint

# 產生正式版靜態檔案（預設 base 為 /）
pnpm build

# 本機預覽正式版
pnpm preview
```

建置結果會放在 `dist/`，可直接部署至 Vercel、Netlify、Cloudflare Pages 或任何靜態網站服務。

部署到 GitHub Pages 這類子路徑時，用環境變數設定 base（CI 已自動帶入）：

```bash
BASE_PATH=/edu-equity-match/ pnpm build
```

## 示範操作

1. 從首頁點「我是想幫忙的學生」，完成專長登錄。
2. 到「探索任務」依專長與線上／實體形式篩選。
3. 進入任務詳情，點「我想參與」並送出報名。
4. 到「管理頁」查看學生、任務與報名，並切換任務狀態。
5. 如需重來，可在管理頁點「重設示範資料」。

## MVP 資料與上線注意事項

- 所有資料只存在目前瀏覽器的 localStorage；清除瀏覽資料後會消失。
- 簡易管理頁沒有登入與權限控制，只適合提案展示或本機測試。
- 正式上線前必須加入帳號驗證、角色權限、資料庫、個資告知與同意、內容審核、檢舉與下架機制。
- 若任務涉及兒少、影像或訪談資料，發布單位必須完成授權、去識別化與保護流程。
- 青年任務應聚焦在倡議與組織支援，不應讓未受訓青年獨自接觸或承擔兒少陪伴工作。

## 專案結構

```text
.
├── src/
│   ├── components/       # 導覽、任務卡、表單共用元件
│   ├── context/          # 全站資料狀態
│   ├── data/             # seed、localStorage repository、測試
│   ├── pages/            # 首頁、列表、詳情、表單、管理頁
│   ├── App.jsx           # 路由
│   ├── constants.js      # 專長、形式與狀態定義
│   ├── main.jsx          # 應用程式入口
│   └── styles.css        # 設計系統與 RWD
├── index.html
├── package.json
└── vite.config.js
```

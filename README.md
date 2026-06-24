# 起跑線上的共鳴｜教育平權青年專長媒合平台 MVP

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
- Supabase repository adapter（可切換成雲端後端）
- Vitest
- 純 CSS，沒有 UI framework

資料讀寫集中在 `src/data/repository.js`。目前支援兩種模式：

- `localStorage`：預設展示模式，不需要後端。
- `Supabase`：真正雲端資料庫模式，任務、學生、報名紀錄會多人共用。

## 安裝與啟動

需要 Node.js 20.19 以上版本。

```bash
npm install
npm run dev
```

瀏覽器開啟 <http://localhost:5173>。

## Supabase 後端模式

如果要讓公開網站真的多人共用資料，請改用 Supabase：

1. 到 Supabase 建立新專案。
2. 在 Supabase SQL Editor 依序執行：
   - `supabase/schema.sql`
   - `supabase/seed.sql`（可選，匯入示範任務）
3. 到 Authentication 建立一組管理員 Email／Password。
4. 建議在 Supabase Auth 設定中關閉公開註冊，只保留你手動建立的管理員帳號。
5. 複製 `.env.example` 成 `.env.local`，填入：

```bash
VITE_DATA_BACKEND=supabase
VITE_SUPABASE_URL=你的 Supabase Project URL
VITE_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

6. 重新啟動：

```bash
npm run dev
```

後端模式下：

- 公開訪客可以瀏覽任務、發布任務、送出學生專長與報名。
- 學生名單與報名聯絡方式需要登入管理頁才看得到。
- 任務列表會讀取 Supabase 雲端資料庫，不再只存在單一瀏覽器。

> 注意：`anon public key` 可以放在前端，但 Supabase 的 `service_role key` 絕對不要放進 `.env.local` 或 GitHub。

### 部署到 GitHub Pages 時

這個專案的 GitHub Actions 已經會讀取以下設定：

- Repository Variable：`VITE_DATA_BACKEND=supabase`
- Repository Secret：`VITE_SUPABASE_URL`
- Repository Secret：`VITE_SUPABASE_ANON_KEY`

如果沒有設定這三個值，公開網站會自動維持 localStorage 展示模式。

## 測試與正式建置

```bash
# 資料層測試
npm test

# 程式碼檢查
npm run lint

# 產生正式版靜態檔案
npm run build

# 本機預覽正式版
npm run preview
```

建置結果會放在 `dist/`，可直接部署至 Vercel、Netlify、Cloudflare Pages 或任何靜態網站服務。

## 示範操作

1. 從首頁點「我是想幫忙的人」，完成專長登錄。
2. 到「探索任務」依專長與線上／實體形式篩選。
3. 進入任務詳情，點「我想參與」並送出報名。
4. 到「管理頁」查看學生、任務與報名，並切換任務狀態。
5. 如需重來，可在管理頁點「重設示範資料」。

## MVP 資料與上線注意事項

- localStorage 模式下，所有資料只存在目前瀏覽器；清除瀏覽資料後會消失。
- Supabase 模式下，資料會保存到雲端資料庫；學生與報名聯絡方式需登入管理頁才可查看。
- 正式營運前仍建議加入更完整的角色權限、發布審核、內容審核、檢舉與下架機制。
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
├── supabase/             # 資料庫 schema 與示範任務 seed
└── vite.config.js
```

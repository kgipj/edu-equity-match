import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base 用環境變數控制，避免只在 CI 命令列以 --base 傳入（在 Windows Git Bash 會被路徑轉換破壞）。
// GitHub Pages 子路徑部署時設 BASE_PATH=/edu-equity-match/；
// 預設 '/' 適用於本機開發與根網域部署（Vercel / Netlify / Cloudflare / 自訂網域）。
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
  server: { port: 5173, host: true },
})

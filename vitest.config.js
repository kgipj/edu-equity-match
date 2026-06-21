import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// 測試設定獨立於 vite.config.js，避免測試環境與建置設定（base 等）互相牽動。
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
})

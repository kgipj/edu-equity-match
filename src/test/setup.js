import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// globals 關閉，故手動在每個測試後卸載，避免 DOM 殘留互相干擾。
afterEach(() => {
  cleanup()
})

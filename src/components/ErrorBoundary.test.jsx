import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'

function Boom() {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  it('renders its children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>安全內容</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('安全內容')).toBeInTheDocument()
  })

  it('renders the recovery UI when a child throws', () => {
    // React 會把攔截到的錯誤印到 console.error，測試中靜音以保持輸出乾淨。
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('頁面暫時無法顯示')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '清除本機資料並重試' })).toBeInTheDocument()
    spy.mockRestore()
  })
})

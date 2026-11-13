// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { InfoOverlay } from '@yearn/vault-widget/internal/components/widget/shared/InfoOverlay'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@yearn/vault-widget/internal/components/shared/Button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  )
}))

afterEach(cleanup)

describe('InfoOverlay accessibility', () => {
  it('removes closed help panels from the focus and scroll flow', () => {
    const close = vi.fn()
    const { rerender } = render(
      <InfoOverlay title="Vault shares" isOpen={false} onClose={close}>
        Share information
      </InfoOverlay>
    )
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByText('Share information')).toBeNull()

    rerender(
      <InfoOverlay title="Vault shares" isOpen onClose={close}>
        Share information
      </InfoOverlay>
    )
    expect(screen.getByRole('heading', { name: 'Vault shares' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Close Vault shares' }))
    expect(close).toHaveBeenCalledOnce()
    rerender(
      <InfoOverlay title="Vault shares" isOpen={false} onClose={close}>
        Share information
      </InfoOverlay>
    )
    expect(screen.queryByRole('button')).toBeNull()
  })
})

// @vitest-environment jsdom

import SeniorLanding from '@pages/senior/SeniorLanding'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import type { HTMLAttributes, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/dynamic', async () => {
  const { useState } = await import('react')
  return {
    default: () =>
      function DepositWidget() {
        const [amount, setAmount] = useState('')
        return <input aria-label="Amount" value={amount} onChange={(event) => setAmount(event.target.value)} />
      }
  }
})

vi.mock('next/image', () => ({ default: () => null }))

vi.mock('framer-motion', async () => {
  const { createElement, forwardRef } = await import('react')
  const animated = (tag: 'div' | 'dialog') =>
    forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>((props, ref) =>
      createElement(tag, {
        ...Object.fromEntries(
          Object.entries(props).filter(
            ([name]) => !['initial', 'animate', 'transition', 'whileInView', 'viewport'].includes(name)
          )
        ),
        ref
      })
    )
  return {
    MotionConfig: ({ children }: { children: ReactNode }) => children,
    motion: { div: animated('div'), dialog: animated('dialog') },
    useReducedMotion: () => true
  }
})

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(performance.now()), 0)
  )
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('Senior deposit panel', () => {
  it.each(['blue', 'paper'] as const)(
    'restores focus and preserves an entered amount after closing and reopening the %s edition',
    async (edition) => {
      render(<SeniorLanding edition={edition} />)
      const trigger = within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', {
        name: 'Deposit'
      })
      trigger.focus()
      fireEvent.click(trigger)

      const dialog = screen.getByRole('dialog', { name: 'Deposit into Senior' })
      const close = within(dialog).getByRole('button', { name: 'Close deposit widget' })
      await waitFor(() => expect(document.activeElement).toBe(close))
      expect(screen.getByRole('main').hasAttribute('inert')).toBe(true)
      expect(screen.getByRole('contentinfo').hasAttribute('inert')).toBe(true)

      const amount = within(dialog).getByRole('textbox', { name: 'Amount' }) as HTMLInputElement
      fireEvent.change(amount, { target: { value: '1250' } })
      amount.focus()
      fireEvent.keyDown(amount, { key: 'Escape' })
      await waitFor(() => expect(document.activeElement).toBe(trigger))
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(screen.getByRole('main').hasAttribute('inert')).toBe(false)
      expect(screen.getByRole('contentinfo').hasAttribute('inert')).toBe(false)

      fireEvent.click(trigger)
      const reopened = screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement
      expect(reopened).toBe(amount)
      expect(reopened.value).toBe('1250')
    }
  )

  it('returns focus to the visible menu summary after opening from the mobile menu', async () => {
    render(<SeniorLanding edition="paper" />)
    const summary = screen.getByText('Menu').closest('summary')
    if (!summary) throw new Error('Mobile menu summary is missing')
    fireEvent.click(summary)
    const trigger = within(screen.getByRole('navigation', { name: 'Mobile navigation' })).getByRole('button', {
      name: 'Deposit'
    })
    fireEvent.click(trigger)
    expect(summary.parentElement?.hasAttribute('open')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Close deposit widget' }))
    await waitFor(() => expect(document.activeElement).toBe(summary))
  })
})

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
vi.mock('@shared/components/Header', () => ({
  default: () => (
    <header aria-label="Yearn header">
      <button type="button">Connect wallet</button>
    </header>
  )
}))
vi.mock('@/AppProviders', () => ({ AppProviders: ({ children }: { children: ReactNode }) => children }))
vi.mock('@shared/contexts/YearnVaultWidgetRuntimeProvider', () => ({
  YearnVaultWidgetRuntimeProvider: ({ children }: { children: ReactNode }) => children
}))

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
    useInView: () => true,
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
    'preloads the hidden form, restores focus and preserves the amount in the %s edition',
    async (edition) => {
      render(<SeniorLanding edition={edition} />)
      const header = screen.getByRole('banner', { name: 'Yearn header' }).parentElement
      expect(screen.queryByRole('combobox')).toBeNull()
      const preloadedDialog = screen.getByRole('dialog', { hidden: true })
      const preloadedAmount = within(preloadedDialog).getByLabelText('Amount')
      expect(preloadedDialog.getAttribute('aria-hidden')).toBe('true')
      expect(preloadedDialog.hasAttribute('inert')).toBe(true)
      expect(screen.queryByRole('dialog')).toBeNull()
      const trigger = screen.getByRole('button', { name: 'Deposit' })
      trigger.focus()
      fireEvent.click(trigger)

      const dialog = screen.getByRole('dialog', { name: 'Deposit into Senior' })
      const close = within(dialog).getByRole('button', { name: 'Close deposit widget' })
      await waitFor(() => expect(document.activeElement).toBe(close))
      expect(header?.hasAttribute('inert')).toBe(true)
      expect(screen.getByRole('main').hasAttribute('inert')).toBe(true)
      expect(screen.getByRole('contentinfo').hasAttribute('inert')).toBe(true)

      const amount = within(dialog).getByRole('textbox', { name: 'Amount' }) as HTMLInputElement
      expect(amount).toBe(preloadedAmount)
      fireEvent.change(amount, { target: { value: '1250' } })
      amount.focus()
      fireEvent.keyDown(amount, { key: 'Escape' })
      await waitFor(() => expect(document.activeElement).toBe(trigger))
      expect(screen.queryByRole('dialog')).toBeNull()
      expect(header?.hasAttribute('inert')).toBe(false)
      expect(screen.getByRole('main').hasAttribute('inert')).toBe(false)
      expect(screen.getByRole('contentinfo').hasAttribute('inert')).toBe(false)

      fireEvent.click(trigger)
      const reopened = screen.getByRole('textbox', { name: 'Amount' }) as HTMLInputElement
      expect(reopened).toBe(amount)
      expect(reopened.value).toBe('1250')
    }
  )
})

describe('Senior waterfall', () => {
  it('shows Senior first for yield, Junior first for losses, and lets the animation pause', () => {
    render(<SeniorLanding edition="paper" />)
    const yieldOrder = screen.getByRole('list', { name: 'Yield distribution order' })
    expect(
      within(yieldOrder)
        .getAllByRole('listitem')
        .map((item) => item.querySelector('strong')?.textContent)
    ).toEqual(['Senior', 'Junior'])

    fireEvent.click(screen.getByRole('button', { name: 'When there is a loss' }))
    const lossOrder = screen.getByRole('list', { name: 'Loss absorption order' })
    expect(
      within(lossOrder)
        .getAllByRole('listitem')
        .map((item) => item.querySelector('strong')?.textContent)
    ).toEqual(['Junior', 'Senior'])
    expect(screen.getByText(/Senior is affected only if that backing runs out/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Pause animation' }))
    const play = screen.getByRole('button', { name: 'Play animation' })
    expect(play.getAttribute('aria-pressed')).toBe('true')
    expect(play.closest('[data-running]')?.getAttribute('data-running')).toBe('false')
    fireEvent.click(play)
    expect(
      screen.getByRole('button', { name: 'Pause animation' }).closest('[data-running]')?.getAttribute('data-running')
    ).toBe('true')
  })
})

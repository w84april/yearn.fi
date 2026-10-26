'use client'

import { WidgetActionType, WidgetTabs } from '@yearn/vault-widget'
import { Button } from '@yearn/vault-widget/internal/components/shared/Button'
import { useState } from 'react'
import { DepositWidgetFrame } from '@/components/ytranche/DepositWidget'

type TStatus = 'input' | 'review' | 'pending' | 'success'
const actions = [WidgetActionType.Deposit, WidgetActionType.Withdraw]
const formatAmount = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value)

export function MockDepositWidget({
  onDepositConfirmed,
  depositLabel = 'Review deposit',
  depositSuccessTitle = 'Deposit confirmed'
}: {
  onDepositConfirmed: () => void
  depositLabel?: string
  depositSuccessTitle?: string
}) {
  const [action, setAction] = useState(WidgetActionType.Deposit)
  const [amount, setAmount] = useState('1000')
  const [position, setPosition] = useState(0)
  const [status, setStatus] = useState<TStatus>('input')
  const isDeposit = action === WidgetActionType.Deposit
  const amountNumber = Number(amount)
  const available = isDeposit ? 10000 - position : position
  const valid = Number.isFinite(amountNumber) && amountNumber > 0 && amountNumber <= available
  const error = amountNumber > available ? `Available: ${formatAmount(available)} USDC` : ''
  const actionName = isDeposit ? 'deposit' : 'withdrawal'

  const confirm = async () => {
    if (!valid || status !== 'review') return
    setStatus('pending')
    // A local confirmation delay stands in for a receipt; this demo never submits a transaction.
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1400))
    setPosition((current) => Math.round((current + (isDeposit ? amountNumber : -amountNumber)) * 1e6) / 1e6)
    setStatus('success')
    if (isDeposit) onDepositConfirmed()
  }

  return (
    <DepositWidgetFrame>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (status === 'input' && valid) setStatus('review')
          else if (status === 'review') void confirm()
        }}
      >
        <fieldset disabled={status === 'pending'} className="forest-widget__fieldset">
          <WidgetTabs
            actions={actions}
            activeAction={action}
            onActionChange={(next) => {
              setAction(next)
              setStatus('input')
              setAmount('')
            }}
          />
          <div className="forest-widget__content" data-widget-part="action-content">
            {status === 'input' ? (
              <>
                <div data-widget-part="amount-input" data-connected="true" className="forest-widget__amount">
                  <div>
                    <div className="forest-widget__row">
                      <label htmlFor="forest-amount">Amount</label>
                      <div data-widget-part="amount-shortcuts">
                        <button type="button" onClick={() => setAmount(String(available))}>
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="forest-widget__row forest-widget__input-row">
                      <input
                        id="forest-amount"
                        value={amount}
                        placeholder="0.00"
                        inputMode="decimal"
                        autoComplete="off"
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? 'forest-amount-error' : undefined}
                        onChange={(event) => {
                          if (/^\d*(?:\.\d{0,6})?$/.test(event.target.value)) setAmount(event.target.value)
                        }}
                      />
                      <span className="forest-widget__token" data-token-selector-button>
                        <svg viewBox="0 0 32 32" width="24" height="24" aria-hidden="true">
                          <circle cx="16" cy="16" r="16" fill="#2775ca" />
                          <path
                            d="M18.7 11.9c-.6-.6-1.5-.9-2.7-.9-1.7 0-2.8.8-2.8 2s1 1.8 2.8 2.2 2.8 1 2.8 2.4-1.1 2.3-2.8 2.3c-1.3 0-2.3-.4-3-1.1M16 8.6v2.2m0 9.2v2.3M10 8.5a9.6 9.6 0 0 0 0 15m12-15a9.6 9.6 0 0 1 0 15"
                            fill="none"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                        USDC
                      </span>
                    </div>
                    <div className="forest-widget__row" data-widget-part="amount-meta">
                      <span>${formatAmount(amountNumber || 0)}</span>
                      <button type="button" onClick={() => setAmount(String(available))}>
                        Balance: {formatAmount(available)}
                      </button>
                    </div>
                  </div>
                </div>
                {error && (
                  <p id="forest-amount-error" className="forest-widget__error" role="alert">
                    {error}
                  </p>
                )}
                <div className="forest-widget__row forest-widget__receive" data-widget-part="transaction-summary">
                  <span>You receive</span>
                  <span>
                    {formatAmount(amountNumber || 0)} {isDeposit ? 'yvUSD-A' : 'USDC'}
                  </span>
                </div>
                <details data-widget-part="transaction-details">
                  <summary>
                    Details <span aria-hidden="true">+</span>
                  </summary>
                  <div className="forest-widget__details" data-widget-part="transaction-details-content">
                    <div className="forest-widget__row">
                      <span>Network</span>
                      <span>Ethereum</span>
                    </div>
                    <div className="forest-widget__row">
                      <span>Position</span>
                      <span>Fixed · Senior</span>
                    </div>
                    <p data-widget-part="transaction-note">
                      Demo balance and share estimates. A 10% performance fee applies to earned yield in the live
                      product.
                    </p>
                  </div>
                </details>
              </>
            ) : status === 'success' ? (
              <div className="forest-widget__confirmation" role="status">
                <span className="forest-widget__check" aria-hidden="true">
                  ✓
                </span>
                <h3>{isDeposit ? depositSuccessTitle : 'Withdrawal confirmed'}</h3>
                <p>
                  {formatAmount(amountNumber)} USDC{' '}
                  {isDeposit ? 'is now in your Fixed position.' : 'returned to your demo balance.'}
                </p>
                <div className="forest-widget__row">
                  <span>Your position</span>
                  <strong>{formatAmount(position)} USDC</strong>
                </div>
              </div>
            ) : (
              <div className="forest-widget__review" aria-live="polite">
                <span className="forest-widget__eyebrow">
                  {status === 'pending' ? 'Confirming your demo transaction' : `Review ${actionName}`}
                </span>
                <h3>
                  {formatAmount(amountNumber)} <span>USDC</span>
                </h3>
                <div className="forest-widget__row">
                  <span>{isDeposit ? 'To' : 'From'}</span>
                  <strong>yTranche · Fixed</strong>
                </div>
                <div className="forest-widget__row">
                  <span>Network</span>
                  <span>Ethereum</span>
                </div>
                <p>No wallet signature or real funds are needed.</p>
              </div>
            )}
            <div data-widget-part="deposit-actions" className="forest-widget__actions">
              {status === 'review' && (
                <button type="button" className="forest-widget__back" onClick={() => setStatus('input')}>
                  ← Edit amount
                </button>
              )}
              {status === 'success' ? (
                <Button
                  type="button"
                  classNameOverride="yearn--button--nextgen w-full"
                  onClick={() => {
                    setStatus('input')
                    setAmount('')
                  }}
                >
                  Make another {actionName}
                </Button>
              ) : (
                <Button
                  type="submit"
                  classNameOverride="yearn--button--nextgen w-full"
                  variant={status === 'pending' ? 'busy' : 'filled'}
                  isBusy={status === 'pending'}
                  disabled={!valid || status === 'pending'}
                >
                  {status === 'pending'
                    ? 'Confirming…'
                    : status === 'input' && isDeposit
                      ? depositLabel
                      : `${status === 'review' ? 'Confirm' : 'Review'} ${actionName}`}
                </Button>
              )}
            </div>
          </div>
        </fieldset>
      </form>
      <p className="forest-widget__demo">Demo mode · No real funds</p>
    </DepositWidgetFrame>
  )
}

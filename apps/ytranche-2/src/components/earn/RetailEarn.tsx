'use client'

import { useState } from 'react'
import { BackgroundGallery } from '@/components/backgrounds/BackgroundGallery'
import { EarnHeader } from '@/components/earn/EarnHeader'
import { StillContent } from '@/components/earn/StillContent'
import { DepositWidget } from '@/components/ytranche/DepositWidget'

const HERO_MESSAGES = [
  {
    id: 'still',
    label: 'Still',
    headline: 'Clock out.',
    support: 'Your USDC has a job. You have a life.'
  },
  {
    id: 'clock-out',
    label: 'Clock out',
    headline: 'Clock out.',
    support: 'Put your USDC to work. Put your attention elsewhere.'
  },
  {
    id: 'less-watching',
    label: 'Less watching',
    headline: 'One less thing to watch.',
    support: 'Less time watching APY. More time for everything else.'
  },
  {
    id: 'less-chasing',
    label: 'Less chasing',
    headline: 'Less chasing. More earning.',
    support: 'Give your USDC a fixed rate and get on with your day.'
  }
] as const

type THeroMessage = (typeof HERO_MESSAGES)[number]

export function RetailEarn() {
  const [message, setMessage] = useState<THeroMessage>(HERO_MESSAGES[0])

  const isStill = message.id === 'still'

  return (
    <div id="still-top" className={isStill ? 'still-page' : undefined}>
      <BackgroundGallery
        copyControls={
          <fieldset className="hero-message-switcher">
            <legend>Hero message</legend>
            <div className="background-gallery__controls hero-message-switcher__options">
              {HERO_MESSAGES.map((option) => (
                <label key={option.id} className="background-option" title={option.headline}>
                  <input
                    type="radio"
                    name="hero-message"
                    value={option.id}
                    aria-label={`${option.label}: ${option.headline}`}
                    checked={message.id === option.id}
                    onChange={() => setMessage(option)}
                    className="sr-only"
                  />
                  <span className="background-option__name">{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        }
      >
        <EarnHeader productName={isStill ? 'Still' : undefined} />
        <main className="ytranche-main" aria-labelledby="clock-out-heading">
          <div className={`clock-out-copy${message.id === 'clock-out' || isStill ? '' : ' clock-out-copy--long'}`}>
            <p className="clock-out-copy__eyebrow">Fixed yield, by Yearn</p>
            <h1 id="clock-out-heading">{message.headline}</h1>
            <p className="clock-out-copy__lead">{isStill ? 'Earn 5% Fixed APY on USDC' : '5% APY'}</p>
            {!isStill && <p className="clock-out-copy__target">Fixed yield on USDC. Annual target.</p>}
            <p className="clock-out-copy__support">{message.support}</p>
            {isStill ? (
              <a className="clock-out-copy__cta still-scroll-link" href="#how-still-works">
                See how Still works
                <span className="still-scroll-link__arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            ) : (
              <>
                <a className="clock-out-copy__cta" href="#earn">
                  Deposit USDC <span aria-hidden="true">↗</span>
                </a>
                <details className="clock-out-details">
                  <summary>
                    How Fixed works <span aria-hidden="true">↗</span>
                  </summary>
                  <div className="clock-out-details__content">
                    <p>
                      Deposit USDC into the Fixed tranche of a shared Yearn vault. Fixed receives its target yield
                      before Levered and Equity.
                    </p>
                    <p>
                      The target is configurable, not a guaranteed APY. Equity and Levered absorb losses before Fixed;
                      returns and principal can still be lost. Withdrawals depend on available vault liquidity.
                    </p>
                    <a href="https://github.com/yearn/ytranche#settlement" target="_blank" rel="noreferrer">
                      Read about the structure <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </details>
              </>
            )}
          </div>
          <DepositWidget />
        </main>
      </BackgroundGallery>
      {isStill && <StillContent />}
    </div>
  )
}

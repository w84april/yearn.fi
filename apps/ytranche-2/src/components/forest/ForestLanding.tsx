'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ForestBackground } from '@/components/forest/ForestBackground'
import { MockDepositWidget } from '@/components/forest/MockDepositWidget'
import '@/components/forest/forest.css'

type THeroVariant = 'flow' | 'touch-grass' | 'personality' | 'nature'
const heroVariants: { value: THeroVariant; label: string }[] = [
  { value: 'flow', label: 'Original' },
  { value: 'touch-grass', label: 'Touch grass' },
  { value: 'personality', label: 'Personality' },
  { value: 'nature', label: 'Nature' }
]
type THeroCopy = {
  eyebrow: string
  headline: string
  secondLine?: string
  description: string
  secondDescription?: string
  beforeDeposit: string
  afterDeposit: string
  depositLabel?: string
}

const heroCopy: Record<THeroVariant, THeroCopy> = {
  flow: {
    eyebrow: 'USDC. A steadier stream.',
    headline: 'Let it flow.',
    description: 'Priority yield. Room to breathe.',
    beforeDeposit: 'A little stillness. A steady flow.',
    afterDeposit: 'Your next chapter, in bloom.'
  },
  'touch-grass': {
    eyebrow: 'Yearn Fixed · USDC',
    headline: 'Earn yield.',
    secondLine: 'Touch grass.',
    description: 'A target APY. No strategy-hopping.',
    secondDescription: 'Less rate-watching. More living.',
    beforeDeposit: 'Your time is yours.',
    afterDeposit: 'Your USDC is working. Enjoy the view.'
  },
  personality: {
    eyebrow: 'Yearn Fixed · USDC',
    headline: 'Your USDC has a job.',
    secondLine: 'You have a life.',
    description: 'Deposit USDC into Yearn Fixed.',
    secondDescription: 'We handle the strategies. You handle the weekend.',
    beforeDeposit: 'Fewer refreshes. More life.',
    afterDeposit: 'Your USDC is on the job. Enjoy the view.',
    depositLabel: 'Put USDC to work'
  },
  nature: {
    eyebrow: 'Yearn Fixed · USDC',
    headline: 'Let your USDC earn.',
    secondLine: 'Let yourself wander.',
    description: 'Put USDC to work with Yearn Fixed.',
    secondDescription: 'The world has more to offer than another refresh.',
    beforeDeposit: 'Take the long way home.',
    afterDeposit: 'You’re all set. Take a breather.',
    depositLabel: 'Let USDC earn'
  }
}

function ForestExperience({
  onReset,
  onVariantChange,
  variant
}: {
  onReset: () => void
  onVariantChange: (variant: THeroVariant) => void
  variant: THeroVariant
}) {
  const copy = heroCopy[variant]
  const campaign = variant === 'personality' || variant === 'nature'
  const [deposited, setDeposited] = useState(false)
  const [paused, setPaused] = useState(false)

  return (
    <div
      className={`ytranche-app forest-landing${campaign ? ' forest-landing--campaign' : ''}`}
      data-deposited={deposited}
      data-hero={variant}
    >
      <ForestBackground deposited={deposited} paused={paused} />
      <header className="forest-header">
        <a href="/" className="forest-brand" aria-label="yTranche by Yearn home">
          <Image src="/yearn-symbol.svg" alt="" width={28} height={33} />
          <span>
            yTranche<small>by yearn</small>
          </span>
        </a>
        <fieldset className="forest-variant-switcher" aria-label="Hero variants">
          {heroVariants.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={variant === option.value}
              onClick={() => onVariantChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </fieldset>
        <nav aria-label="Product information">
          <a href="https://gov.yearn.fi/t/yip-91-ytranche/14659" target="_blank" rel="noreferrer">
            The structure ↗
          </a>
          <a href="https://www.chainsecurity.com/security-audit/yearn-ytranche" target="_blank" rel="noreferrer">
            Security ↗
          </a>
        </nav>
        <span className="forest-header__demo">
          <span aria-hidden="true" /> Interactive demo
        </span>
      </header>

      <main className="forest-main">
        <div className="forest-main__column">
          <div className="forest-copy">
            <p>{copy.eyebrow}</p>
            <h1>
              {copy.headline}
              {copy.secondLine && (
                <>
                  {' '}
                  <br />
                  <span>{copy.secondLine}</span>
                </>
              )}
            </h1>
            <span>
              {copy.description}
              {copy.secondDescription && (
                <>
                  <br />
                  {copy.secondDescription}
                </>
              )}
            </span>
            {campaign && (
              <a
                className="forest-copy__proof"
                href="https://gov.yearn.fi/t/yip-91-ytranche/14659"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 16 16" aria-hidden="true" fill="none">
                  <path
                    d="m3 8 3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                First in line for yield <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
          <MockDepositWidget
            onDepositConfirmed={() => setDeposited(true)}
            depositLabel={copy.depositLabel}
            depositSuccessTitle={campaign ? 'You’re all set.' : undefined}
          />
          <p className="forest-risk">
            {variant === 'flow'
              ? 'Priority does not mean risk-free. Yield and principal are not guaranteed.'
              : 'APY targets can change. Yield and principal are not guaranteed.'}
          </p>
        </div>
      </main>

      <footer className="forest-footer">
        <p aria-live="polite">
          <span aria-hidden="true" /> {deposited ? copy.afterDeposit : copy.beforeDeposit}
        </p>
        <div className="forest-footer__controls">
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? 'Play background' : 'Pause background'}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
              {paused ? <path d="m6 3 10 7-10 7V3Z" /> : <path d="M5 4h3v12H5zm7 0h3v12h-3z" />}
            </svg>
            <span>{paused ? 'Play scene' : 'Pause scene'}</span>
          </button>
          <button type="button" onClick={onReset}>
            Reset demo <span aria-hidden="true">↺</span>
          </button>
        </div>
      </footer>
    </div>
  )
}

export function ForestLanding({ variant = 'flow' }: { variant?: THeroVariant }) {
  const [session, setSession] = useState(0)
  const [activeVariant, setActiveVariant] = useState(variant)
  return (
    <ForestExperience
      key={session}
      variant={activeVariant}
      onVariantChange={setActiveVariant}
      onReset={() => setSession((value) => value + 1)}
    />
  )
}

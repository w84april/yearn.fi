'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ForestBackground } from '@/components/forest/ForestBackground'
import { MockDepositWidget } from '@/components/forest/MockDepositWidget'
import '@/components/forest/forest.css'

function ForestExperience({ onReset }: { onReset: () => void }) {
  const [deposited, setDeposited] = useState(false)
  const [paused, setPaused] = useState(false)

  return (
    <div className="ytranche-app forest-landing" data-deposited={deposited}>
      <ForestBackground deposited={deposited} paused={paused} />
      <header className="forest-header">
        <a href="/" className="forest-brand" aria-label="yTranche by Yearn home">
          <Image src="/yearn-symbol.svg" alt="" width={28} height={33} />
          <span>
            yTranche<small>by yearn</small>
          </span>
        </a>
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
            <p>USDC. A steadier stream.</p>
            <h1>Let it flow.</h1>
            <span>Priority yield. Room to breathe.</span>
          </div>
          <MockDepositWidget onDepositConfirmed={() => setDeposited(true)} />
          <p className="forest-risk">Priority does not mean risk-free. Yield and principal are not guaranteed.</p>
        </div>
      </main>

      <footer className="forest-footer">
        <p aria-live="polite">
          <span aria-hidden="true" />{' '}
          {deposited ? 'Your next chapter, in bloom.' : 'A little stillness. A steady flow.'}
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

export function ForestLanding() {
  const [session, setSession] = useState(0)
  return <ForestExperience key={session} onReset={() => setSession((value) => value + 1)} />
}

'use client'

import { useState } from 'react'

const AUDIT_URL = 'https://www.chainsecurity.com/security-audit/yearn-ytranche'
const CONTRACTS_URL = 'https://etherscan.io/address/0x2D4F47208853a3D20EADCbdA0F03900771C6Eba3#code'
const SYSTEM_URL = 'https://github.com/yearn/ytranche#settlement'

const YIELD_STEPS = [
  { label: 'Yield source', title: 'Yearn vault' },
  { label: 'First priority', title: 'Still target' },
  { label: 'After targets', title: 'Junior allocation' }
]
const LOSS_STEPS = [
  { label: 'First to absorb', title: 'Equity' },
  { label: 'Next in line', title: 'Levered' },
  { label: 'Last in line', title: 'Still' }
]
const TERMS = [
  {
    name: 'Rate',
    description: 'A fixed target, not a guaranteed return. The rate can change; accrual can pause after loss.'
  },
  { name: 'Withdrawals', description: 'Subject to available vault liquidity and withdrawal limits.' },
  { name: 'Fees', description: 'Review the applicable fees and net rate before confirming.' },
  { name: 'Risk', description: 'Contract, strategy and USDC risks. Your deposit can lose value.' }
]

export function StillContent() {
  const [flow, setFlow] = useState<'yield' | 'loss'>('yield')
  const steps = flow === 'yield' ? YIELD_STEPS : LOSS_STEPS

  return (
    <section className="still-content" id="how-still-works" aria-label="How Still works" tabIndex={-1}>
      <section className="still-section" aria-labelledby="still-product-heading">
        <div className="still-section__inner">
          <p className="still-section__eyebrow">01 · The product</p>
          <h2 id="still-product-heading">
            A clear rate.
            <br />A senior position.
          </h2>
          <p className="still-section__intro">
            Still is the senior USDC position in Yearn’s tranche system. Earn toward a fixed target while Yearn vault
            strategies do the work underneath.
          </p>
          <div className="still-section__links">
            <a href={AUDIT_URL} target="_blank" rel="noreferrer">
              Read the audit <span aria-hidden="true">↗</span>
            </a>
            <a href={CONTRACTS_URL} target="_blank" rel="noreferrer">
              Explore the contracts <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <section className="still-section still-section--sage" aria-labelledby="still-flow-heading">
        <div className="still-section__inner">
          <p className="still-section__eyebrow">02 · How it works</p>
          <h2 id="still-flow-heading">
            One yield engine.
            <br />A different place in line.
          </h2>
          <p className="still-section__intro">
            Your deposit enters a Yearn vault. The tranche system sets the order for yield and losses.
          </p>
          <fieldset className="still-flow-switch">
            <legend className="sr-only">Show yield or loss order</legend>
            <button
              type="button"
              aria-pressed={flow === 'yield'}
              aria-controls="still-flow"
              onClick={() => setFlow('yield')}
            >
              When there is yield
            </button>
            <button
              type="button"
              aria-pressed={flow === 'loss'}
              aria-controls="still-flow"
              onClick={() => setFlow('loss')}
            >
              When there is a loss
            </button>
          </fieldset>
          <div id="still-flow" className="still-flow" aria-live="polite" aria-atomic="true">
            <ol
              className="still-flow__steps"
              aria-label={flow === 'yield' ? 'Yield priority' : 'Loss absorption order'}
            >
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className={
                    index === (flow === 'yield' ? 1 : 2)
                      ? 'still-flow__step still-flow__step--still'
                      : 'still-flow__step'
                  }
                >
                  <span className="still-flow__label">{step.label}</span>
                  <span className="still-flow__title">{step.title}</span>
                  {index < steps.length - 1 && (
                    <span className="still-flow__arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="still-flow__note">
              {flow === 'yield'
                ? 'Still’s target has priority over junior distributions.'
                : 'Junior capital absorbs losses before Still. If it is exhausted, Still can lose principal.'}
            </p>
          </div>
        </div>
      </section>

      <section className="still-section" id="still-terms" aria-labelledby="still-terms-heading">
        <div className="still-section__inner">
          <p className="still-section__eyebrow">03 · Before you deposit</p>
          <h2 id="still-terms-heading">Know the terms.</h2>
          <dl className="still-terms">
            {TERMS.map((term) => (
              <div key={term.name}>
                <dt>{term.name}</dt>
                <dd>{term.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="still-section" aria-labelledby="still-questions-heading">
        <div className="still-section__inner">
          <p className="still-section__eyebrow">04 · Questions</p>
          <h2 id="still-questions-heading">A few practical things.</h2>
          <div className="still-questions">
            <details>
              <summary>
                What does “senior” mean?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Still has priority for its target yield. Equity and Levered absorb losses before Still, but that buffer
                is finite. Senior does not mean risk-free.
              </p>
            </details>
            <details>
              <summary>
                How do I take my USDC out?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Use Withdraw in the widget above to redeem your position for USDC. Still has no tranche cooldown;
                withdrawals depend on available vault liquidity and withdrawal limits.
              </p>
              <a href="#earn">
                Back to the widget <span aria-hidden="true">↑</span>
              </a>
            </details>
            <details>
              <summary>
                Where can I inspect the system?<span aria-hidden="true">+</span>
              </summary>
              <p>
                Read the published audit, inspect the deployed vault contract, or explore the tranche contracts and
                their yield and loss ordering.
              </p>
              <div className="still-section__links">
                <a href={AUDIT_URL} target="_blank" rel="noreferrer">
                  Audit <span aria-hidden="true">↗</span>
                </a>
                <a href={CONTRACTS_URL} target="_blank" rel="noreferrer">
                  Contract <span aria-hidden="true">↗</span>
                </a>
                <a href={SYSTEM_URL} target="_blank" rel="noreferrer">
                  System <span aria-hidden="true">↗</span>
                </a>
              </div>
            </details>
          </div>
        </div>
      </section>

      <footer className="still-footer">
        <div className="still-footer__inner">
          <a className="still-footer__brand" href="#still-top" aria-label="Still, back to top">
            Still <span>by Yearn</span>
          </a>
          <nav aria-label="Still information">
            <a href={CONTRACTS_URL} target="_blank" rel="noreferrer">
              Contracts
            </a>
            <a href={AUDIT_URL} target="_blank" rel="noreferrer">
              Audit
            </a>
            <a href="#still-terms">Terms &amp; risks</a>
          </nav>
        </div>
      </footer>
    </section>
  )
}

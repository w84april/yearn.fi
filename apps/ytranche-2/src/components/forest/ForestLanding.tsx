'use client'

import { useRef, useState } from 'react'
import { EarnHeader } from '@/components/earn/EarnHeader'
import { ForestBackground } from '@/components/forest/ForestBackground'
import { MockDepositWidget } from '@/components/forest/MockDepositWidget'
import '@/components/forest/forest.css'

type THeroVariant = 'flow' | 'touch-grass' | 'personality' | 'nature'
type THeroLayout = 'stacked' | 'widget-left' | 'deposit-reveal'
const heroLayouts: { value: THeroLayout; label: string }[] = [
  { value: 'stacked', label: 'Original' },
  { value: 'widget-left', label: 'Widget left' },
  { value: 'deposit-reveal', label: 'Deposit reveal' }
]
const heroVariants: { value: THeroVariant; label: string }[] = [
  { value: 'flow', label: 'Original' },
  { value: 'touch-grass', label: 'Touch grass' },
  { value: 'personality', label: 'Personality' },
  { value: 'nature', label: 'Nature' }
]
type THeroCopy = {
  headline: string
  secondLine?: string
  description: string
  secondDescription?: string
  beforeDeposit?: string
  afterDeposit?: string
  depositLabel?: string
}

const heroCopy: Record<THeroVariant, THeroCopy> = {
  flow: {
    headline: 'Let it flow.',
    description: 'Priority yield. Room to breathe.',
    beforeDeposit: 'A little stillness. A steady flow.',
    afterDeposit: 'Your next chapter, in bloom.'
  },
  'touch-grass': {
    headline: 'Earn yield.',
    secondLine: 'Touch grass.',
    description: 'A target APY. No strategy-hopping.',
    secondDescription: 'Less rate-watching. More living.',
    beforeDeposit: 'Your time is yours.',
    afterDeposit: 'Your USDC is working. Enjoy the view.'
  },
  personality: {
    headline: 'Your USDC has a job.',
    secondLine: 'You have a life.',
    description: 'Deposit USDC into Yearn Fixed.',
    secondDescription: 'We handle the strategies. You handle the weekend.',
    beforeDeposit: 'Fewer refreshes. More life.',
    afterDeposit: 'Your USDC is on the job. Enjoy the view.',
    depositLabel: 'Put USDC to work'
  },
  nature: {
    headline: 'Let your USDC earn',
    secondLine: 'Let yourself wander.',
    description: 'Put USDC to work with Yearn Fixed.',
    secondDescription: 'The world has more to offer than another refresh.',
    depositLabel: 'Let USDC earn'
  }
}

function ForestExperience({
  onReset,
  onVariantChange,
  variant,
  layout,
  onLayoutChange
}: {
  onReset: () => void
  onVariantChange: (variant: THeroVariant) => void
  variant: THeroVariant
  layout: THeroLayout
  onLayoutChange: (layout: THeroLayout) => void
}) {
  const copy = heroCopy[variant]
  const campaign = variant === 'personality' || variant === 'nature'
  const [deposited, setDeposited] = useState(false)
  const [paused, setPaused] = useState(false)
  const [widgetOpen, setWidgetOpen] = useState(false)
  const widgetPanel = useRef<HTMLDivElement>(null)
  const depositButton = useRef<HTMLButtonElement>(null)
  const reveal = layout === 'deposit-reveal'
  const widgetHidden = reveal && !widgetOpen
  const footerMessage = deposited ? copy.afterDeposit : copy.beforeDeposit

  const showWidget = () => {
    setWidgetOpen(true)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.requestAnimationFrame(() => widgetPanel.current?.querySelector('input')?.focus({ preventScroll: true }))
    }
  }

  return (
    <div
      className={`ytranche-app forest-landing${campaign ? ' forest-landing--campaign' : ''}`}
      data-deposited={deposited}
      data-hero={variant}
      data-layout={layout}
      data-widget-open={widgetOpen}
    >
      <ForestBackground deposited={deposited} paused={paused} />
      <EarnHeader transparent />

      <main className="forest-main">
        <div className="forest-main__column">
          <div
            className="forest-copy"
            inert={reveal && widgetOpen}
            aria-hidden={reveal && widgetOpen}
            onTransitionEnd={(event) => {
              if (
                reveal &&
                !widgetOpen &&
                event.target === event.currentTarget &&
                event.propertyName === 'transform' &&
                document.activeElement === document.body
              ) {
                depositButton.current?.focus({ preventScroll: true })
              }
            }}
          >
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
            {layout !== 'stacked' && (
              <p className="forest-copy__rate">
                <strong>5%</strong> Fixed APY on USDC
              </p>
            )}
            <span>
              {copy.description}
              {copy.secondDescription && (
                <>
                  <br />
                  {copy.secondDescription}
                </>
              )}
            </span>
            {campaign && <p className="forest-copy__proof">Less rate-watching. More living.</p>}
            {reveal && (
              <div className="forest-copy__actions">
                <button
                  ref={depositButton}
                  type="button"
                  className="forest-deposit-button"
                  onClick={showWidget}
                  aria-expanded={widgetOpen}
                  aria-controls="forest-deposit-panel"
                >
                  Deposit USDC <span aria-hidden="true">↗</span>
                </button>
              </div>
            )}
          </div>
          <div
            ref={widgetPanel}
            id="forest-deposit-panel"
            className="forest-deposit-panel"
            inert={widgetHidden}
            aria-hidden={widgetHidden}
            onTransitionEnd={(event) => {
              if (
                reveal &&
                widgetOpen &&
                event.target === event.currentTarget &&
                event.propertyName === 'transform' &&
                document.activeElement === document.body
              ) {
                widgetPanel.current?.querySelector('input')?.focus({ preventScroll: true })
              }
            }}
          >
            {reveal && (
              <button
                type="button"
                className="forest-deposit-panel__back"
                onClick={() => {
                  setWidgetOpen(false)
                  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    window.requestAnimationFrame(() => depositButton.current?.focus({ preventScroll: true }))
                  }
                }}
              >
                <span aria-hidden="true">←</span> Back to the view
              </button>
            )}
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
        </div>
      </main>

      <footer className="forest-footer">
        {footerMessage && (
          <p aria-live="polite">
            <span aria-hidden="true" /> {footerMessage}
          </p>
        )}
        <div className="forest-options">
          <fieldset className="forest-variant-switcher" aria-label="Hero variants">
            <legend>Copy</legend>
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
          <fieldset className="forest-variant-switcher" aria-label="Hero layouts">
            <legend>Layout</legend>
            {heroLayouts.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={layout === option.value}
                onClick={() => {
                  setWidgetOpen(false)
                  onLayoutChange(option.value)
                }}
              >
                {option.label}
              </button>
            ))}
          </fieldset>
        </div>
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

export function ForestLanding({
  variant = 'flow',
  layout = 'stacked'
}: {
  variant?: THeroVariant
  layout?: THeroLayout
}) {
  const [session, setSession] = useState(0)
  const [activeVariant, setActiveVariant] = useState(variant)
  const [activeLayout, setActiveLayout] = useState(layout)
  return (
    <ForestExperience
      key={session}
      variant={activeVariant}
      layout={activeLayout}
      onLayoutChange={setActiveLayout}
      onVariantChange={setActiveVariant}
      onReset={() => setSession((value) => value + 1)}
    />
  )
}

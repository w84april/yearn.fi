'use client'

import { type ReactNode, useState, useSyncExternalStore } from 'react'
import { BACKGROUNDS, BackgroundScene, type TBackgroundId } from '@/components/backgrounds/BackgroundScene'
import { VideoBackground } from '@/components/backgrounds/VideoBackground'

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const getVisibility = () => document.visibilityState === 'visible'
const getServerVisibility = () => true

export function BackgroundGallery({ children }: { children: ReactNode }) {
  const [variant, setVariant] = useState<TBackgroundId>('blossom-flow')
  const [isPaused, setIsPaused] = useState(false)
  const isVisible = useSyncExternalStore(subscribeToVisibility, getVisibility, getServerVisibility)
  const selectedIndex = BACKGROUNDS.findIndex((background) => background.id === variant)
  const selected = BACKGROUNDS[selectedIndex]

  return (
    <div
      className="ytranche-app background-gallery"
      data-background={variant}
      data-motion={isPaused || !isVisible ? 'paused' : 'playing'}
    >
      {'video' in selected ? (
        <VideoBackground
          key={variant}
          src={selected.video}
          poster={selected.poster}
          isPlaying={!isPaused && isVisible}
        />
      ) : (
        <BackgroundScene key={variant} variant={selected.id} />
      )}
      {children}
      <footer className="background-gallery__footer">
        <div className="background-gallery__caption" aria-live="polite" aria-atomic="true">
          <span className="background-gallery__eyebrow">Background study</span>
          <p>{selected.name}</p>
          {variant === 'blossom-flow' && (
            <details className="blossom-story">
              <summary>
                Read the flow <span aria-hidden="true">↗</span>
              </summary>
              <div className="blossom-story__panel">
                <h2>One source. Different ways to bloom.</h2>
                <p>
                  The three tranches share one underlying Yearn vault. The blooms represent Fixed, Levered, and Equity.
                </p>
                <h3>Water carries the yield</h3>
                <p>
                  Each tranche accrues its target. Additional yield is shared according to the configured allocations.
                </p>
                <h3>The lower layers absorb losses first</h3>
                <p>
                  After available reserve support, losses reach Equity, then Levered, then Fixed. Every tier can lose
                  value.
                </p>
                <a href="https://github.com/yearn/ytranche#settlement" target="_blank" rel="noreferrer">
                  Read the settlement model ↗
                </a>
              </div>
            </details>
          )}
        </div>
        <div className="background-gallery__controls">
          <fieldset className="background-gallery__options">
            <legend className="sr-only">Choose a background</legend>
            {BACKGROUNDS.map((background) => (
              <label key={background.id} className="background-option" title={background.name}>
                <input
                  type="radio"
                  name="background"
                  value={background.id}
                  aria-label={background.name}
                  checked={background.id === variant}
                  onChange={() => setVariant(background.id)}
                  className="sr-only"
                />
                <span
                  className="background-option__swatch"
                  style={{ backgroundColor: background.color }}
                  aria-hidden="true"
                />
                <span className="background-option__name">{background.name}</span>
              </label>
            ))}
          </fieldset>
          <span className="background-gallery__divider" aria-hidden="true" />
          <button
            type="button"
            className="background-motion"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-label={isPaused ? 'Play background animation' : 'Pause background animation'}
            aria-pressed={isPaused}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              {isPaused ? <path d="m6 3 10 7-10 7V3Z" /> : <path d="M5 4h3v12H5zm7 0h3v12h-3z" />}
            </svg>
          </button>
        </div>
        <span className="background-gallery__count" aria-hidden="true">
          {String(selectedIndex + 1).padStart(2, '0')} <span>/ {String(BACKGROUNDS.length).padStart(2, '0')}</span>
        </span>
      </footer>
    </div>
  )
}

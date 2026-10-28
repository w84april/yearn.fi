'use client'

import { type ReactNode, useState, useSyncExternalStore } from 'react'
import { BACKGROUNDS } from '@/components/backgrounds/BackgroundScene'
import { VideoBackground } from '@/components/backgrounds/VideoBackground'

const landscapes = BACKGROUNDS.filter((background) => 'video' in background)
type TLandscapeId = (typeof landscapes)[number]['id']

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const getVisibility = () => document.visibilityState === 'visible'
const getServerVisibility = () => true

export function BackgroundGallery({ children, copyControls }: { children: ReactNode; copyControls?: ReactNode }) {
  const [variant, setVariant] = useState<TLandscapeId>('meadow-light')
  const [isPaused, setIsPaused] = useState(false)
  const isVisible = useSyncExternalStore(subscribeToVisibility, getVisibility, getServerVisibility)
  const selected = landscapes.find((background) => background.id === variant) ?? landscapes[0]

  return (
    <div
      className="ytranche-app background-gallery"
      data-background={variant}
      data-motion={isPaused || !isVisible ? 'paused' : 'playing'}
    >
      <VideoBackground key={variant} src={selected.video} poster={selected.poster} isPlaying={!isPaused && isVisible} />
      {children}
      <footer className="background-gallery__footer">
        <div className="background-gallery__context">
          {copyControls}
          <p className="background-gallery__network">USDC on Ethereum</p>
        </div>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Landscape: {selected.name}
        </span>
        <div className="background-gallery__controls">
          <fieldset className="background-gallery__options">
            <legend className="sr-only">Choose a landscape</legend>
            {landscapes.map((background) => (
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
      </footer>
    </div>
  )
}

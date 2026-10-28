'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToReducedMotion(onChange: () => void) {
  const preference = window.matchMedia(reducedMotionQuery)
  preference.addEventListener('change', onChange)
  return () => preference.removeEventListener('change', onChange)
}

const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches
const getServerReducedMotion = () => true

type TVideoBackgroundProps = { src: string; poster: string; isPlaying: boolean }

export function VideoBackground({ src, poster, isPlaying }: TVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isReducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion)

  // Native media playback needs imperative synchronization with visibility and motion controls.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying && !isReducedMotion) {
      void video.play().catch(() => {
        // The poster remains visible if the browser blocks autoplay.
      })
    } else {
      video.pause()
    }

    return () => video.pause()
  }, [isPlaying, isReducedMotion])

  return (
    <div
      className="background-scene background-scene--video"
      style={{ backgroundImage: `url("${poster}")` }}
      aria-hidden="true"
    >
      {!isReducedMotion && (
        <video
          ref={videoRef}
          className="background-scene__video"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        />
      )}
      <div className="background-scene__video-shade" />
    </div>
  )
}

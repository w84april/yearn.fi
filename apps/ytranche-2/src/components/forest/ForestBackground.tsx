'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

type TLoop = 'foggy' | 'sunny'
const MEDIA = '/backgrounds/forest'
const loops: TLoop[] = ['foggy', 'sunny']
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function subscribeToMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange)
  return () => document.removeEventListener('visibilitychange', onChange)
}

const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches
const getVisibility = () => document.visibilityState === 'visible'
const getServerMotion = () => true
const getServerVisibility = () => true

export function ForestBackground({ deposited, paused }: { deposited: boolean; paused: boolean }) {
  const videos = useRef<Record<TLoop, HTMLVideoElement | null>>({ foggy: null, sunny: null })
  const [sunnyReady, setSunnyReady] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerMotion)
  const visible = useSyncExternalStore(subscribeToVisibility, getVisibility, getServerVisibility)
  const stillScene = deposited ? 'sunny' : 'foggy'
  const displayedScene =
    reducedMotion || playbackBlocked
      ? stillScene
      : deposited && sunnyReady
        ? revealed
          ? 'sunny'
          : 'transition'
        : 'foggy'

  // Video playback and seeking are imperative APIs. Match the shared eight-second
  // foliage/water phase before blending, and keep both loops moving during the reveal.
  useEffect(() => {
    const foggy = videos.current.foggy
    const sunny = videos.current.sunny
    if (!foggy || !sunny) return
    const controller = new AbortController()
    const playing = deposited ? (revealed ? [sunny] : [foggy, sunny]) : [foggy]
    const stop = () => {
      foggy.pause()
      sunny.pause()
    }
    if (paused || reducedMotion || !visible) {
      stop()
      return
    }
    if (deposited && !revealed) sunny.currentTime = foggy.currentTime % 8
    if (!deposited) sunny.pause()
    if (revealed) foggy.pause()
    void Promise.all(playing.map((video) => video.play()))
      .then(() => {
        if (controller.signal.aborted) return
        setPlaybackBlocked(false)
        if (deposited) setSunnyReady(true)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          stop()
          setPlaybackBlocked(true)
        }
      })
    return () => {
      controller.abort()
      stop()
    }
  }, [deposited, revealed, paused, reducedMotion, visible])

  return (
    <div className="forest-background" data-scene={displayedScene} data-paused={paused || !visible} aria-hidden="true">
      {loops.map((scene) => (
        <video
          key={scene}
          ref={(video) => {
            videos.current[scene] = video
          }}
          data-forest-video={scene}
          className="forest-background__video"
          src={`${MEDIA}/${scene}.mp4?v=motion-60-1`}
          poster={`${MEDIA}/${scene}.jpg?v=clear-sunny-2`}
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onAnimationEnd={scene === 'sunny' ? () => setRevealed(true) : undefined}
          onError={() => {
            if (scene === (deposited ? 'sunny' : 'foggy')) setPlaybackBlocked(true)
          }}
        />
      ))}
      <div className="forest-background__shade" />
    </div>
  )
}

'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

type TScene = 'foggy' | 'transition' | 'sunny'
const MEDIA = '/backgrounds/forest'
const scenes: TScene[] = ['foggy', 'transition', 'sunny']
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
  const videos = useRef<Record<TScene, HTMLVideoElement | null>>({ foggy: null, transition: null, sunny: null })
  const [activeScene, setActiveScene] = useState<TScene>('foggy')
  const [revealed, setRevealed] = useState(false)
  const [playbackBlocked, setPlaybackBlocked] = useState(false)
  const reducedMotion = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerMotion)
  const visible = useSyncExternalStore(subscribeToVisibility, getVisibility, getServerVisibility)
  const targetScene: TScene = deposited ? (revealed || reducedMotion ? 'sunny' : 'transition') : 'foggy'
  const stillScene = deposited ? 'sunny' : 'foggy'
  const displayedScene = reducedMotion || playbackBlocked ? stillScene : activeScene

  // Playback is an imperative browser API; keep each buffered video in sync with the scene and visibility.
  useEffect(() => {
    scenes
      .filter((scene) => scene !== targetScene)
      .forEach((scene) => {
        videos.current[scene]?.pause()
      })
    const video = videos.current[targetScene]
    if (!video) return
    if (paused || reducedMotion || !visible) {
      video.pause()
      return
    }
    void video
      .play()
      .then(() => setPlaybackBlocked(false))
      .catch(() => setPlaybackBlocked(true))
    return () => video.pause()
  }, [targetScene, paused, reducedMotion, visible])

  return (
    <div className="forest-background" data-scene={displayedScene} aria-hidden="true">
      {scenes.map((scene) => (
        <video
          key={scene}
          ref={(video) => {
            videos.current[scene] = video
          }}
          data-forest-video={scene}
          className="forest-background__video"
          style={{ opacity: displayedScene === scene ? 1 : 0 }}
          src={`${MEDIA}/${scene}.mp4?v=clear-sunny-2`}
          poster={`${MEDIA}/${scene === 'sunny' ? 'sunny' : 'foggy'}.jpg?v=clear-sunny-2`}
          muted
          loop={scene !== 'transition'}
          playsInline
          preload="auto"
          tabIndex={-1}
          onPlaying={() => setActiveScene(scene)}
          onEnded={
            scene === 'transition'
              ? () => {
                  // The reveal ends halfway through the eight-second foliage cycle.
                  const sunny = videos.current.sunny
                  if (sunny) sunny.currentTime = 4
                  setRevealed(true)
                }
              : undefined
          }
          onError={() => {
            if (scene === 'transition') setRevealed(true)
            else if (scene === targetScene) setPlaybackBlocked(true)
          }}
        />
      ))}
      <div className="forest-background__shade" />
    </div>
  )
}

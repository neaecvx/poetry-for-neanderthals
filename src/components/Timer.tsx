import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { playTick } from '../utils/sfx'

export function Timer() {
  const seconds = useGameStore((s) => s.timerSeconds)
  const running = useGameStore((s) => s.timerRunning)
  const tick = useGameStore((s) => s.tick)
  const lastTicked = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => tick(), 1000)
    return () => clearInterval(id)
  }, [running, tick])

  useEffect(() => {
    if (running && seconds > 0 && seconds <= 10 && lastTicked.current !== seconds) {
      lastTicked.current = seconds
      playTick()
    }
    if (seconds > 10) lastTicked.current = null
  }, [seconds, running])

  const pct = Math.max(0, (seconds / 90) * 100)
  const color =
    seconds <= 10 ? 'var(--accent-red)' : seconds <= 30 ? 'var(--accent-fire)' : 'var(--accent-green)'

  return (
    <div style={{ width: 'min(600px,90vw)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Time</span>
        <span>{seconds}s</span>
      </div>
      <div style={barStyle}>
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color})`,
            transition: 'width 0.3s ease, background 0.3s ease',
            borderRadius: '999px',
          }}
        />
      </div>
    </div>
  )
}

const barStyle: React.CSSProperties = {
  height: '12px',
  background: 'rgba(255,255,255,0.1)',
  borderRadius: '999px',
  overflow: 'hidden',
}

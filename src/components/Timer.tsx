import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { playTick } from '../utils/sfx'

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function Timer() {
  const seconds = useGameStore((s) => s.timerSeconds)
  const turnSeconds = useGameStore((s) => s.turnSeconds)
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

  const pct = Math.max(0, Math.min(100, (seconds / turnSeconds) * 100))
  const low = seconds <= 10
  const warn = !low && seconds <= Math.min(30, turnSeconds * 0.4)
  const state = low ? ' timer--low' : warn ? ' timer--warn' : ''

  return (
    <div className={`timer${state}`}>
      <div className="timer__head">
        <span className="timer__label">Time</span>
        <span className="timer__value">{formatTime(seconds)}</span>
      </div>
      <div
        className="timer__track"
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={turnSeconds}
        aria-valuenow={seconds}
      >
        <div className="timer__fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Timer } from '../Timer'
import { Card } from '../Card'
import { ScoreSlate } from '../ScoreSlate'

export default function GameScreen() {
  const teams = useGameStore((s) => s.teams)
  const currentTeamIndex = useGameStore((s) => s.currentTeamIndex)
  const turnsTaken = useGameStore((s) => s.turnsTaken)
  const turnsPerTeam = useGameStore((s) => s.turnsPerTeam)
  const poetCards = useGameStore((s) => s.poetCards)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const bank1 = useGameStore((s) => s.bank1)
  const bank3 = useGameStore((s) => s.bank3)
  const skip = useGameStore((s) => s.skip)
  const bonk = useGameStore((s) => s.bonk)
  const endTurn = useGameStore((s) => s.endTurn)
  const rematch = useGameStore((s) => s.rematch)
  const timerRunning = useGameStore((s) => s.timerRunning)
  const timerSeconds = useGameStore((s) => s.timerSeconds)
  const stopTimer = useGameStore((s) => s.stopTimer)
  const [flash, setFlash] = useState(false)

  const card = poetCards[currentCardIndex]

  useEffect(() => {
    if (timerRunning && timerSeconds <= 0) {
      stopTimer()
      endTurn()
    }
  }, [timerSeconds, timerRunning, stopTimer, endTurn])

  if (!card) return null

  const doBonk = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 450)
    bonk()
  }

  const settledCards = poetCards.filter((c, i) => c.status !== 'active' && i !== currentCardIndex)

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {flash && <div style={flashStyle} />}
      <div style={{ display: 'flex', gap: 'clamp(1rem,4vw,3rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {teams.map((t, i) => (
          <div
            key={i}
            style={{
              ...scoreChip,
              opacity: i === currentTeamIndex ? 1 : 0.5,
              borderColor: i === currentTeamIndex ? 'var(--accent-fire)' : 'var(--border-stone)',
            }}
          >
            <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
              {t.name} · turn {Math.min(turnsTaken[i] + 1, turnsPerTeam)}/{turnsPerTeam}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{t.score}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 'clamp(0.5rem,2vw,1rem)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={btnStyle} onClick={bank1}>
          ✓ 1 point
        </button>
        <button style={btnStyle} onClick={bank3}>
          ✓ 3 points
        </button>
        <button style={{ ...btnStyle, borderColor: 'var(--accent-red)' }} onClick={skip}>
          ⏭ Skip (−1)
        </button>
        <button style={bonkBtnStyle} onClick={doBonk}>
          🔨 BONK! (−1)
        </button>
      </div>
      <Timer />
      <Card key={card.id} card={card} />
      {settledCards.length > 0 && (
        <div style={{ width: 'min(600px,90vw)' }}>
          <div style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '0.5rem' }}>
            This turn's slate
          </div>
          <ScoreSlate cards={settledCards} />
        </div>
      )}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <button style={endStyle} onClick={endTurn}>
          End turn early
        </button>
        <button
          style={endStyle}
          onClick={() => {
            if (window.confirm('Restart the game? Current scores will be lost.')) rematch()
          }}
        >
          Restart game
        </button>
      </div>
    </div>
  )
}

const flashStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(214, 69, 51, 0.45)',
  zIndex: 100,
  animation: 'bonkFlash 0.45s ease-out forwards',
  pointerEvents: 'none',
}

const scoreChip: React.CSSProperties = {
  padding: '0.5rem 1.25rem',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: 'var(--radius-lg)',
  border: '2px solid var(--border-stone)',
  minWidth: '140px',
}

const btnStyle: React.CSSProperties = {
  padding: '0.75rem 1.25rem',
  borderRadius: '12px',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  border: '2px solid var(--accent-green)',
  fontSize: 'clamp(0.9rem,2vw,1.05rem)',
  fontWeight: 700,
}

const bonkBtnStyle: React.CSSProperties = {
  padding: '0.75rem 1.25rem',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #8b4513, #654321)',
  color: 'var(--accent-bone)',
  border: '3px solid #d4af37',
  fontSize: 'clamp(0.9rem,2vw,1.05rem)',
  fontWeight: 900,
  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
}

const endStyle: React.CSSProperties = {
  background: 'none',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  textDecoration: 'underline',
}

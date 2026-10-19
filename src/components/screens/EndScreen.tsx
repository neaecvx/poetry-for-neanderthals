import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { playWin } from '../../utils/sfx'

export default function EndScreen() {
  const teams = useGameStore((s) => s.teams)
  const rematch = useGameStore((s) => s.rematch)
  useEffect(() => {
    playWin()
  }, [])
  const t1 = teams[0]
  const t2 = teams[1]
  const winner = t1.score > t2.score ? t1.name : t2.score > t1.score ? t2.name : 'Tie'

  return (
    <div className="screen">
      <h1 className="screen-title">Game Over</h1>
      <p className="subtitle">{winner === 'Tie' ? 'Tie game!' : `${winner} wins!`}</p>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={cardStyle}>
          <h2>{t1.name}</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800 }}>{t1.score}</div>
        </div>
        <div style={cardStyle}>
          <h2>{t2.name}</h2>
          <div style={{ fontSize: '3rem', fontWeight: 800 }}>{t2.score}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button style={buttonStyle} onClick={rematch}>
          Rematch
        </button>
        <button style={{ ...buttonStyle, background: 'var(--bg-secondary)', border: 'var(--border-stone)' }} onClick={() => window.location.reload()}>
          New Game
        </button>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: 'var(--border-stone)',
  borderRadius: 'var(--radius-xl)',
  padding: '2rem 3rem',
}
const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, var(--accent-fire), var(--accent-fire-light))',
  color: 'var(--text-primary)',
  fontSize: '1.125rem',
  fontWeight: 700,
}

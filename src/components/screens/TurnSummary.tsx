import { useGameStore } from '../../store/gameStore'

export default function TurnSummary() {
  const teams = useGameStore((s) => s.teams)
  const currentTeamIndex = useGameStore((s) => s.currentTeamIndex)
  const poetCards = useGameStore((s) => s.poetCards)
  const nextTurn = useGameStore((s) => s.nextTurn)
  const rematch = useGameStore((s) => s.rematch)

  const team = teams[currentTeamIndex]
  const earned = poetCards.reduce((sum, c) => {
    if (c.status === 'banked3') return sum + 3
    if (c.status === 'banked1') return sum + 1
    return sum
  }, 0)
  const penalties = poetCards.filter(
    (c) => c.status === 'skipped' || c.status === 'bonked'
  ).length
  const net = earned - penalties

  const statusLabel: Record<string, string> = {
    banked1: '+1 banked',
    banked3: '+3 banked',
    skipped: '−1',
    bonked: '−1',
  }

  return (
    <div className="screen">
      <h1 className="screen-title">{team.name} Turn Summary</h1>
      <p className="subtitle">
        This turn: {net >= 0 ? '+' : ''}{net} ({earned} earned − {penalties} penalty{penalties === 1 ? '' : 'ies'}) · {team.name} total: {team.score}
      </p>
      <div style={{ maxWidth: 'min(800px,90vw)' }}>
        {poetCards.map((c, i) => (
          <div key={i} style={rowStyle}>
            <div>
              <strong>{c.easy}</strong> → <strong>{c.hard}</strong>
            </div>
            <div>{statusLabel[c.status] ?? c.status}</div>
          </div>
        ))}
      </div>
      <button style={buttonStyle} onClick={nextTurn}>
        Next Turn
      </button>
      <button
        style={restartStyle}
        onClick={() => {
          if (window.confirm('Restart the game? Current scores will be lost.')) rematch()
        }}
      >
        Restart game
      </button>
    </div>
  )
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.75rem 1rem',
  margin: '0.25rem 0',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
}
const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, var(--accent-fire), var(--accent-fire-light))',
  color: 'var(--text-primary)',
  fontSize: '1.125rem',
  fontWeight: 700,
}
const restartStyle: React.CSSProperties = {
  background: 'none',
  color: 'var(--text-secondary)',
  fontSize: '0.9rem',
  textDecoration: 'underline',
  marginTop: '1rem',
}

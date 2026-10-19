import { useGameStore } from '../../store/gameStore'

export default function TurnIntro() {
  const teams = useGameStore((s) => s.teams)
  const currentTeamIndex = useGameStore((s) => s.currentTeamIndex)
  const startTurn = useGameStore((s) => s.startTurn)
  const rematch = useGameStore((s) => s.rematch)
  const team = teams[currentTeamIndex]

  return (
    <div className="screen">
      <h1 className="screen-title">Pass to {team.name}</h1>
      <p className="subtitle">Pick your Poet. Press Start when ready.</p>
      <p className="subtitle" style={{ color: 'var(--accent-fire)', fontWeight: 700 }}>
        Describe using only ONE-syllable words!
      </p>
      <button style={buttonStyle} onClick={startTurn}>
        Start Turn
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

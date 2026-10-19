import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function SetupScreen() {
  const setup = useGameStore((s) => s.setup)
  const [team1, setTeam1] = useState('Team A')
  const [team2, setTeam2] = useState('Team B')
  const [turnsPerTeam, setTurnsPerTeam] = useState(3)
  const [deckSide, setDeckSide] = useState<'blue' | 'red' | 'mixed'>('blue')
  const [turnSeconds, setTurnSeconds] = useState(90)

  return (
    <div className="screen">
      <img className="app-banner" src="app-banner.png" alt="Abugabuga" />
      <p className="subtitle">Use one-syllable clues only</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 'min(400px,90vw)' }}>
        <input
          style={inputStyle}
          value={team1}
          onChange={(e) => setTeam1(e.target.value)}
          placeholder="Team 1 name"
        />
        <input
          style={inputStyle}
          value={team2}
          onChange={(e) => setTeam2(e.target.value)}
          placeholder="Team 2 name"
        />
        <select
          style={selectStyle}
          value={turnsPerTeam}
          onChange={(e) => setTurnsPerTeam(Number(e.target.value))}
        >
          <option value={1}>1 turn per team</option>
          <option value={2}>2 turns per team</option>
          <option value={3}>3 turns per team</option>
          <option value={4}>4 turns per team</option>
          <option value={5}>5 turns per team</option>
        </select>
        <select
          style={selectStyle}
          value={turnSeconds}
          onChange={(e) => setTurnSeconds(Number(e.target.value))}
        >
          <option value={30}>30 seconds per turn</option>
          <option value={60}>60 seconds per turn</option>
          <option value={90}>90 seconds per turn</option>
          <option value={120}>120 seconds per turn</option>
          <option value={150}>150 seconds per turn</option>
        </select>
        <select
          style={selectStyle}
          value={deckSide}
          onChange={(e) => setDeckSide(e.target.value as any)}
        >
          <option value="blue">Blue (Easy)</option>
          <option value="red">Red (Hard)</option>
          <option value="mixed">Mixed</option>
        </select>
        <button
          style={buttonStyle}
          onClick={() => setup({ team1, team2, turnsPerTeam, deckSide, turnSeconds })}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  border: 'var(--border-stone)',
  background: 'var(--bg-secondary)',
  color: 'var(--text-primary)',
  fontSize: '1rem',
}
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' }
const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, var(--accent-fire), var(--accent-fire-light))',
  color: 'var(--text-primary)',
  fontSize: '1.125rem',
  fontWeight: 700,
}

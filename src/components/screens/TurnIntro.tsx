import { useGameStore } from '../../store/gameStore'

export default function TurnIntro() {
  const teams = useGameStore((s) => s.teams)
  const currentTeamIndex = useGameStore((s) => s.currentTeamIndex)
  const turnsTaken = useGameStore((s) => s.turnsTaken)
  const turnsPerTeam = useGameStore((s) => s.turnsPerTeam)
  const startTurn = useGameStore((s) => s.startTurn)
  const rematch = useGameStore((s) => s.rematch)
  const team = teams[currentTeamIndex]
  const turn = Math.min(turnsTaken[currentTeamIndex] + 1, turnsPerTeam)

  return (
    <div className="screen">
      <div className="stack">
        <p className="eyebrow">
          Team {currentTeamIndex + 1} · Turn {turn} of {turnsPerTeam}
        </p>
        <h1 className="screen-title">Pass to {team.name}</h1>
        <p className="subtitle">Pick your Poet. Press Start when ready.</p>
        <p className="hint">Describe using only one-syllable words.</p>
      </div>
      <div className="stack stack--narrow">
        <button className="btn btn--primary btn--block" onClick={startTurn}>
          Start Turn
        </button>
        <button
          className="btn btn--ghost"
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

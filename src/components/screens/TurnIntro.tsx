import { useGameStore } from '../../store/gameStore'
import { Masthead } from '../Masthead'

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
    <div className="page">
      <Masthead meta={`Turn ${turn} of ${turnsPerTeam}`} />
      <div className="center">
        <div className="intro">
          <p className="kicker">Team {currentTeamIndex + 1} · up next</p>
          <h1 className="display display--intro">
            Pass to <em>{team.name}</em>.
          </h1>
          <p className="lede">
            Pick your Poet. When everyone is ready, start the clock and give clues
            using one-syllable words.
          </p>
          <div className="intro__actions">
            <button className="btn btn--solid btn--lg" onClick={startTurn}>
              Start turn
            </button>
            <button
              className="ghost"
              onClick={() => {
                if (window.confirm('Restart the game? Current scores will be lost.')) rematch()
              }}
            >
              Restart game
            </button>
          </div>
          <p className="note">Clues must be one syllable.</p>
        </div>
      </div>
    </div>
  )
}

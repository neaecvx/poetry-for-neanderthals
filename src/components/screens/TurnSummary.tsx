import { useGameStore } from '../../store/gameStore'
import { Masthead } from '../Masthead'

function points(status: string) {
  if (status === 'banked3') return 3
  if (status === 'banked1') return 1
  if (status === 'skipped' || status === 'bonked') return -1
  return 0
}

function signed(value: number) {
  if (value === 0) return '0'
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`
}

function signedPoints(value: number) {
  if (value === 0) return '—'
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`
}

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
  const deductions = poetCards.filter(
    (c) => c.status === 'skipped' || c.status === 'bonked'
  ).length
  const net = earned - deductions

  return (
    <div className="page">
      <Masthead meta="Scorecard" />
      <div className="center">
        <div className="sheet summary">
          <div className="summary__head">
            <div>
              <p className="kicker kicker--ink">Turn complete</p>
              <h1 className="display display--ink summary__title">{team.name}</h1>
            </div>
            <button className="btn btn--ink btn--sm" onClick={nextTurn}>
              Next turn
            </button>
          </div>

          <div className="summary__figures">
            <div className="figure">
              <span className="figure__label">This turn</span>
              <span className="figure__value figure__value--accent num">{signed(net)}</span>
            </div>
            <div className="figure">
              <span className="figure__label">Team total</span>
              <span className="figure__value num">{team.score}</span>
            </div>
          </div>

          <p className="summary__breakdown">
            {earned} earned · {deductions} deduction{deductions === 1 ? '' : 's'}
          </p>

          <ul className="summary__list">
            {poetCards.map((c, i) => {
              const value = points(c.status)
              const tone =
                value > 0
                  ? 'summary__pts--pos'
                  : value < 0
                    ? 'summary__pts--neg'
                    : ''
              return (
                <li key={i} className="summary__row">
                  <span className="summary__word">
                    <strong>{c.easy}</strong> → {c.hard}
                  </span>
                  <span className={`summary__pts num ${tone}`}>{signedPoints(value)}</span>
                </li>
              )
            })}
          </ul>

          <button
            className="ghost ghost--ink summary__restart"
            onClick={() => {
              if (window.confirm('Restart the game? Current scores will be lost.')) rematch()
            }}
          >
            Restart game
          </button>
        </div>
      </div>
    </div>
  )
}

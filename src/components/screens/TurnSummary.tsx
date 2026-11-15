import { useGameStore } from '../../store/gameStore'

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
    <div className="screen">
      <div className="stack">
        <p className="eyebrow">Turn complete</p>
        <h1 className="screen-title">{team.name} summary</h1>
        <div className="stack stack--narrow">
          <button className="btn btn--primary btn--block" onClick={nextTurn}>
            Next Turn
          </button>
        </div>
        <p className="summary-line">
          This turn <strong>{signed(net)}</strong> ({earned} earned − {deductions} deduction
          {deductions === 1 ? '' : 's'}) · Total <strong>{team.score}</strong>
        </p>
      </div>
      <div className="slate">
        <div className="slate__head">
          <span className="slate__title">Cards</span>
        </div>
        <ul className="slate__list">
          {poetCards.map((c, i) => {
            const value = points(c.status)
            const tone = value > 0 ? 'slate__pts--pos' : value < 0 ? 'slate__pts--neg' : ''
            return (
              <li key={i} className="slate__row">
                <span className="slate__answer">
                  <strong>{c.easy}</strong> → {c.hard}
                </span>
                <span className={`slate__pts ${tone}`}>
                  {value === 0 ? '—' : signed(value)}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
      <button
        className="btn btn--ghost"
        onClick={() => {
          if (window.confirm('Restart the game? Current scores will be lost.')) rematch()
        }}
      >
        Restart game
      </button>
    </div>
  )
}

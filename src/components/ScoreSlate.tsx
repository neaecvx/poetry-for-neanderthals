import type { PoetCard } from '../store/gameStore'

function points(status: PoetCard['status']) {
  if (status === 'banked3') return 3
  if (status === 'banked1') return 1
  if (status === 'skipped' || status === 'bonked') return -1
  return 0
}

function signed(value: number) {
  if (value === 0) return '—'
  return `${value > 0 ? '+' : '−'}${Math.abs(value)}`
}

export function ScoreSlate({ cards }: { cards: PoetCard[] }) {
  const net = cards.reduce((sum, c) => sum + points(c.status), 0)

  return (
    <section className="slate" aria-label="This turn's cards">
      <div className="slate__head">
        <span className="slate__title">This turn</span>
        <span className="slate__total num">{signed(net)}</span>
      </div>
      <ul className="slate__list">
        {cards.map((c, i) => {
          const value = points(c.status)
          const tone = value > 0 ? 'slate__pts--pos' : value < 0 ? 'slate__pts--neg' : ''
          return (
            <li key={i} className="slate__row">
              <span className="slate__answer">{c.easy}</span>
              <span className={`slate__pts num ${tone}`}>{signed(value)}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

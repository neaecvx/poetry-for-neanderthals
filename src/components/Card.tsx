import type { PoetCard } from '../store/gameStore'

function highlight(easy: string, hard: string) {
  const index = hard.toLowerCase().indexOf(easy.toLowerCase())
  if (index === -1) return hard
  return (
    <>
      {hard.slice(0, index)}
      <span className="hl">{hard.slice(index, index + easy.length)}</span>
      {hard.slice(index + easy.length)}
    </>
  )
}

export function Card({ card }: { card: PoetCard }) {
  return (
    <div className="card">
      <div className="card__tier">
        <span className="chip chip--easy">
          Easy <span className="chip__pts">1 pt</span>
        </span>
        <div className="card__answer card__answer--easy">{card.easy}</div>
      </div>
      <div className="card__divider">then</div>
      <div className="card__tier">
        <span className="chip chip--hard">
          Hard <span className="chip__pts">3 pts</span>
        </span>
        <div className="card__answer card__answer--hard">{highlight(card.easy, card.hard)}</div>
      </div>
    </div>
  )
}

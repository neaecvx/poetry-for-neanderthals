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
    <div className="question">
      <div className="tier">
        <span className="tier__num num">1</span>
        <div className="tier__body">
          <span className="tier__label">One point</span>
          <span className="tier__word tier__word--easy">{card.easy}</span>
        </div>
      </div>
      <div className="tier-divider">
        <span className="tier-divider__label">then</span>
      </div>
      <div className="tier">
        <span className="tier__num num">3</span>
        <div className="tier__body">
          <span className="tier__label">Three points</span>
          <span className="tier__word tier__word--hard">{highlight(card.easy, card.hard)}</span>
        </div>
      </div>
    </div>
  )
}

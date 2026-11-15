import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { playWin } from '../../utils/sfx'

export default function EndScreen() {
  const teams = useGameStore((s) => s.teams)
  const rematch = useGameStore((s) => s.rematch)
  useEffect(() => {
    playWin()
  }, [])
  const t1 = teams[0]
  const t2 = teams[1]
  const winningIndex = t1.score > t2.score ? 0 : t2.score > t1.score ? 1 : -1

  return (
    <div className="screen">
      <div className="stack">
        <p className="eyebrow">Game over</p>
        <h1 className="screen-title">
          {winningIndex === -1 ? "It's a tie" : `${teams[winningIndex].name} wins`}
        </h1>
      </div>
      <div className="result-grid">
        {teams.map((t, i) => (
          <div key={i} className={i === winningIndex ? 'result result--winner' : 'result'}>
            <span className="result__name">{t.name}</span>
            <span className="result__score">{t.score}</span>
          </div>
        ))}
      </div>
      <div className="stack stack--narrow">
        <button className="btn btn--primary btn--block" onClick={rematch}>
          Rematch
        </button>
        <button className="btn btn--ghost" onClick={() => window.location.reload()}>
          New Game
        </button>
      </div>
    </div>
  )
}

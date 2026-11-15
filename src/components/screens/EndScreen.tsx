import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { playWin } from '../../utils/sfx'
import { Masthead } from '../Masthead'

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
    <div className="page">
      <Masthead meta="Final" />
      <div className="center">
        <div className="finale">
          <p className="kicker">That&apos;s the game</p>
          <h1 className="display display--finale">
            {winningIndex === -1 ? (
              <>
                It&apos;s a <em>draw.</em>
              </>
            ) : (
              <>
                <em>{teams[winningIndex].name}</em> wins.
              </>
            )}
          </h1>

          <div className="finale__scores">
            {teams.map((t, i) => (
              <div
                key={i}
                className={
                  i === winningIndex ? 'finale__team finale__team--winner' : 'finale__team'
                }
              >
                <span className="finale__name">{t.name}</span>
                <span className="finale__score num">{t.score}</span>
              </div>
            ))}
          </div>

          <div className="finale__actions">
            <button className="btn btn--solid btn--lg" onClick={rematch}>
              Rematch
            </button>
            <button className="ghost" onClick={() => window.location.reload()}>
              New game
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

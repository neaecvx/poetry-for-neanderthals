import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Timer } from '../Timer'
import { Card } from '../Card'
import { ScoreSlate } from '../ScoreSlate'

export default function GameScreen() {
  const teams = useGameStore((s) => s.teams)
  const currentTeamIndex = useGameStore((s) => s.currentTeamIndex)
  const turnsTaken = useGameStore((s) => s.turnsTaken)
  const turnsPerTeam = useGameStore((s) => s.turnsPerTeam)
  const poetCards = useGameStore((s) => s.poetCards)
  const currentCardIndex = useGameStore((s) => s.currentCardIndex)
  const bank1 = useGameStore((s) => s.bank1)
  const bank3 = useGameStore((s) => s.bank3)
  const skip = useGameStore((s) => s.skip)
  const bonk = useGameStore((s) => s.bonk)
  const endTurn = useGameStore((s) => s.endTurn)
  const rematch = useGameStore((s) => s.rematch)
  const timerRunning = useGameStore((s) => s.timerRunning)
  const timerSeconds = useGameStore((s) => s.timerSeconds)
  const stopTimer = useGameStore((s) => s.stopTimer)
  const [flash, setFlash] = useState(false)

  const card = poetCards[currentCardIndex]

  useEffect(() => {
    if (timerRunning && timerSeconds <= 0) {
      stopTimer()
      endTurn()
    }
  }, [timerSeconds, timerRunning, stopTimer, endTurn])

  if (!card) return null

  const doBonk = () => {
    setFlash(true)
    setTimeout(() => setFlash(false), 450)
    bonk()
  }

  const settledCards = poetCards.filter((c, i) => c.status !== 'active' && i !== currentCardIndex)

  return (
    <div className="screen screen--game">
      {flash && <div className="bonk-flash" />}
      <div className="hud">
        <div className="scoreboard">
          {teams.map((t, i) => {
            const active = i === currentTeamIndex
            const turn = Math.min(turnsTaken[i] + 1, turnsPerTeam)
            return (
              <div key={i} className={active ? 'team team--active' : 'team'}>
                <div className="team__info">
                  <span className="team__name">{t.name}</span>
                  <span className="team__turn">
                    {active && <span className="team__dot" aria-hidden="true" />}
                    Turn {turn}/{turnsPerTeam}
                  </span>
                </div>
                <span className="team__score">{t.score}</span>
              </div>
            )
          })}
        </div>
        <div className="actions">
          <button className="btn btn--positive" onClick={bank1}>
            1 point
          </button>
          <button className="btn btn--positive" onClick={bank3}>
            3 points
          </button>
          <button className="btn btn--danger" onClick={skip}>
            Skip −1
          </button>
          <button className="btn btn--danger" onClick={doBonk}>
            NO! −1
          </button>
        </div>
        <Timer />
      </div>
      <Card key={card.id} card={card} />
      {settledCards.length > 0 && <ScoreSlate cards={settledCards} />}
      <div className="footer-links">
        <button className="btn btn--ghost" onClick={endTurn}>
          End turn early
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

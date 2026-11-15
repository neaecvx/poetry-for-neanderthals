import { useEffect, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { Masthead } from '../Masthead'
import { Timer } from '../Timer'
import { Card } from '../Card'
import { ScoreSlate } from '../ScoreSlate'

const deckLabels: Record<string, string> = {
  blue: 'Blue deck',
  red: 'Red deck',
  mixed: 'Mixed deck',
}

export default function GameScreen() {
  const teams = useGameStore((s) => s.teams)
  const currentTeamIndex = useGameStore((s) => s.currentTeamIndex)
  const turnsTaken = useGameStore((s) => s.turnsTaken)
  const turnsPerTeam = useGameStore((s) => s.turnsPerTeam)
  const deckSide = useGameStore((s) => s.deckSide)
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
    <div className="page page--game">
      {flash && <div className="bonk-flash" />}
      <Masthead meta={deckLabels[deckSide]} />

      <section className="scoreboard" aria-label="Scoreboard">
        {teams.map((t, i) => {
          const active = i === currentTeamIndex
          const turn = Math.min(turnsTaken[i] + 1, turnsPerTeam)
          return (
            <div key={i} className={active ? 'team team--active' : 'team'}>
              <span className="team__name">
                {active && <span className="team__mark" aria-hidden="true" />}
                {t.name}
              </span>
              <span className="team__score num">{t.score}</span>
              <span className="team__turn">
                Turn {turn} of {turnsPerTeam}
              </span>
            </div>
          )
        })}
      </section>

      <main className="stage">
        <Card key={card.id} card={card} />
        <Timer />
      </main>

      <section className="console" aria-label="Scoring controls">
        <div className="award-group">
          <button className="award" onClick={bank1}>
            <span className="award__num num">1</span>
            <span className="award__text">point</span>
          </button>
          <button className="award award--three" onClick={bank3}>
            <span className="award__num num">3</span>
            <span className="award__text">points</span>
          </button>
        </div>
        <div className="penalty-group">
          <button className="penalty" onClick={skip}>
            Skip <span className="penalty__pts num">−1</span>
          </button>
          <button className="penalty penalty--no" onClick={doBonk}>
            NO! <span className="penalty__pts num">−1</span>
          </button>
        </div>
      </section>

      {settledCards.length > 0 && <ScoreSlate cards={settledCards} />}

      <footer className="game__footer">
        <button className="ghost" onClick={endTurn}>
          End turn early
        </button>
        <button
          className="ghost"
          onClick={() => {
            if (window.confirm('Restart the game? Current scores will be lost.')) rematch()
          }}
        >
          Restart game
        </button>
      </footer>
    </div>
  )
}

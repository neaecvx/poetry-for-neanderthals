import { useState } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function SetupScreen() {
  const setup = useGameStore((s) => s.setup)
  const [team1, setTeam1] = useState('Team A')
  const [team2, setTeam2] = useState('Team B')
  const [turnsPerTeam, setTurnsPerTeam] = useState(3)
  const [deckSide, setDeckSide] = useState<'blue' | 'red' | 'mixed'>('blue')
  const [turnSeconds, setTurnSeconds] = useState(90)

  return (
    <div className="screen">
      <div className="stack">
        <img className="app-banner" src="app-banner.png" alt="Abugabuga" />
        <p className="subtitle">Use one-syllable clues only</p>
      </div>
      <div className="panel">
        <div className="field">
          <label className="field__label" htmlFor="team-1">
            Team 1
          </label>
          <input
            id="team-1"
            className="input"
            value={team1}
            onChange={(e) => setTeam1(e.target.value)}
            placeholder="Team 1 name"
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor="team-2">
            Team 2
          </label>
          <input
            id="team-2"
            className="input"
            value={team2}
            onChange={(e) => setTeam2(e.target.value)}
            placeholder="Team 2 name"
          />
        </div>
        <div className="field-row">
          <div className="field">
            <label className="field__label" htmlFor="turns">
              Turns per team
            </label>
            <select
              id="turns"
              className="select"
              value={turnsPerTeam}
              onChange={(e) => setTurnsPerTeam(Number(e.target.value))}
            >
              <option value={1}>1 turn</option>
              <option value={2}>2 turns</option>
              <option value={3}>3 turns</option>
              <option value={4}>4 turns</option>
              <option value={5}>5 turns</option>
            </select>
          </div>
          <div className="field">
            <label className="field__label" htmlFor="seconds">
              Turn length
            </label>
            <select
              id="seconds"
              className="select"
              value={turnSeconds}
              onChange={(e) => setTurnSeconds(Number(e.target.value))}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
              <option value={150}>150 seconds</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label className="field__label" htmlFor="deck">
            Deck
          </label>
          <select
            id="deck"
            className="select"
            value={deckSide}
            onChange={(e) => setDeckSide(e.target.value as 'blue' | 'red' | 'mixed')}
          >
            <option value="blue">Blue (Easy)</option>
            <option value="red">Red (Hard)</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>
        <button
          className="btn btn--primary btn--block"
          onClick={() => setup({ team1, team2, turnsPerTeam, deckSide, turnSeconds })}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

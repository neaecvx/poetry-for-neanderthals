import { useGameStore } from '../store/gameStore'
import SetupScreen from './screens/SetupScreen'
import TurnIntro from './screens/TurnIntro'
import GameScreen from './screens/GameScreen'
import TurnSummary from './screens/TurnSummary'
import EndScreen from './screens/EndScreen'

export function Game() {
  const phase = useGameStore((s) => s.phase)

  switch (phase) {
    case 'SETUP':
      return <SetupScreen />
    case 'TURN_INTRO':
      return <TurnIntro />
    case 'PLAYING':
      return <GameScreen />
    case 'TURN_SUMMARY':
      return <TurnSummary />
    case 'END':
      return <EndScreen />
    default:
      return <SetupScreen />
  }
}

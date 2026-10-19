import type { PoetCard } from '../store/gameStore'

export function Card({ card }: { card: PoetCard }) {
  return (
    <div style={cardStyle}>
      <div style={{ opacity: 0.6, fontSize: 'clamp(0.9rem,2vw,1.1rem)' }}>Easy (1 pt)</div>
      <div style={easyStyle}>{card.easy}</div>
      <div style={{ margin: '1rem 0', opacity: 0.4 }}>then</div>
      <div style={{ opacity: 0.6, fontSize: 'clamp(0.9rem,2vw,1.1rem)' }}>
        Hard (3 pts total — contains the word)
      </div>
      <div style={hardStyle}>{card.hard}</div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: 'var(--border-bone)',
  borderRadius: 'var(--radius-xl)',
  padding: 'clamp(1.5rem,4vw,3rem)',
  boxShadow: 'var(--shadow-heavy)',
  maxWidth: 'min(800px,90vw)',
  animation: 'cardPop 0.25s ease-out',
}

const easyStyle: React.CSSProperties = {
  fontSize: 'clamp(1.75rem,5vw,3rem)',
  fontWeight: 800,
  color: 'var(--accent-blue)',
  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
}

const hardStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem,6vw,4rem)',
  fontWeight: 900,
  color: 'var(--accent-fire-light)',
  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
}

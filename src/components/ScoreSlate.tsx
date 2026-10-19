import type { PoetCard } from '../store/gameStore'

const statusLabel: Record<string, string> = {
  banked1: '+1',
  banked3: '+3',
  skipped: '−1',
  bonked: '−1',
}

export function ScoreSlate({ cards }: { cards: PoetCard[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {cards.map((c, i) => (
        <div key={i} style={row}>
          <span>{c.easy}</span>
          <span>{statusLabel[c.status] ?? c.status}</span>
        </div>
      ))}
    </div>
  )
}

const row: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '8px',
}

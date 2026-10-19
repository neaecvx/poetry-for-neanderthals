import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

export default function Splash() {
  const dismissSplash = useGameStore((s) => s.dismissSplash)

  useEffect(() => {
    const t = setTimeout(dismissSplash, 2600)
    return () => clearTimeout(t)
  }, [dismissSplash])

  return (
    <div
      className="splash"
      onClick={dismissSplash}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') dismissSplash()
      }}
      role="button"
      tabIndex={0}
      aria-label="Skip splash screen"
    >
      <img
        src="splash.png"
        alt="NeonDev Code Studio"
        className="splash-img"
        draggable={false}
      />
      <span className="splash-skip">tap to skip</span>
    </div>
  )
}

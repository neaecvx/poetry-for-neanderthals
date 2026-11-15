export function Masthead({ meta }: { meta?: string }) {
  return (
    <header className="masthead">
      <span className="masthead__brand">
        Abugabuga<span className="masthead__dot">.</span>
      </span>
      {meta && <span className="masthead__meta">{meta}</span>}
    </header>
  )
}

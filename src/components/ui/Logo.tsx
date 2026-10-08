import './Logo.css'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo__word">DINO&rsquo;S</span>
      <span className="logo__rule" aria-hidden="true" />
      <span className="logo__sub">
        <span>Auto Body</span>
        <span>Repairs</span>
      </span>
    </span>
  )
}

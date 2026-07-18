'use client'

// Fixed 64px left rail — part of the aidesigner editorial system.
// Present on every route. Hidden on <lg to keep mobile clean.
export function SideRail() {
  return (
    <aside
      aria-hidden
      className="hidden lg:flex fixed top-0 left-0 h-screen w-16 z-40 flex-col items-center justify-between py-8 pointer-events-none"
      style={{
        borderRight: '1px solid var(--line)',
        background: 'var(--bg)',
      }}
    >
      <span
        className="text-xs uppercase tracking-widest font-display leading-none"
        style={{
          color: 'var(--text)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: '0.3em',
        }}
      >
        EST. 2019
      </span>

      <span
        className="text-[10px] font-bold uppercase whitespace-nowrap"
        style={{
          color: 'var(--text-subtle)',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: '0.35em',
        }}
      >
        Douala / Yaoundé — Cameroun
      </span>

      <span
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ background: 'var(--accent-warm)' }}
      />
    </aside>
  )
}

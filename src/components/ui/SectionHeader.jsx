import ScrollHeading from '../motion/ScrollHeading'
import { SectionKicker } from './Button.jsx'

export default function SectionHeader({
  kicker,
  title,
  titleLines,
  description,
  dark = false,
  align = 'left',
  action,
  withDivider = false,
  className = '',
  headingClassName = '',
}) {
  const lines = titleLines ?? (title ? [title] : [])
  const isCenter = align === 'center'
  return (
    <div
      className={`${isCenter ? 'text-center' : ''} ${withDivider ? 'pb-0' : ''} ${className}`.trim()}
    >
      {kicker && (
        <SectionKicker dark={dark} className={isCenter ? 'justify-center' : ''}>
          {kicker}
        </SectionKicker>
      )}
      {lines.length > 0 && (
        <ScrollHeading
          lines={lines}
          className={`${headingClassName || `text-4xl font-bold tracking-tight sm:text-5xl ${dark ? 'text-cream' : ''}`}`.trim()}
        />
      )}
      {description && (
        <p className={`mt-3 max-w-xl ${isCenter ? 'mx-auto' : ''} ${dark ? 'text-cream/70' : 'text-primary/60'}`}>
          {description}
        </p>
      )}
      {action && <div className={`mt-6 ${isCenter ? 'flex justify-center' : ''}`}>{action}</div>}
      {withDivider && (
        <div aria-hidden="true" className="mt-10 flex items-center gap-4">
          <span className={`h-1.5 flex-1 ${dark ? 'bg-cream' : 'bg-primary shadow-[4px_4px_0_0_rgba(9,63,180,0.18)]'}`} />
          <span className={`h-3 w-3 shrink-0 ${dark ? 'bg-cream' : 'bg-primary'}`} />
          <span className={`h-1.5 flex-1 ${dark ? 'bg-cream' : 'bg-primary shadow-[4px_4px_0_0_rgba(9,63,180,0.18)]'}`} />
        </div>
      )}
    </div>
  )
}

export function PageHeader({ kicker, titleLines, description, className = '' }) {
  return (
    <section
      data-nav-theme="light"
      className={`relative isolate overflow-hidden border-b border-primary/10 bg-cream py-24 text-center sm:py-28 ${className}`.trim()}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-primary pixel-bg" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeader
          kicker={kicker}
          titleLines={titleLines}
          description={description}
          align="center"
          headingClassName="text-4xl font-bold tracking-tight sm:text-6xl"
        />
      </div>
    </section>
  )
}

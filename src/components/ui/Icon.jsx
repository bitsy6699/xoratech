import { ICONS } from '../../assets/streamline/icons'

export default function Icon({ name, className = '' }) {
  if (!ICONS[name]) return null
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  )
}
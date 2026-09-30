import logoSrc from '../assets/logo.png'

// The ChronoMap compass-and-globe mark from the Figma design.
export default function Logo({ size = 40 }) {
  return (
    <img
      src={logoSrc}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="brand-logo"
      draggable="false"
    />
  )
}

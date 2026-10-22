
import { useEffect, useState } from 'react'
import { countryNameFor, flagImageUrl } from '../data/countries.js'

// Display a country flag with a fallback if the image fails to load.
export default function CountryFlag({
  code,
  size = 20,
  className = '',
}) {
  const [failed, setFailed] = useState(false)
  const src = flagImageUrl(code)

  // Reset the error state when a different country is selected.
  useEffect(() => setFailed(false), [code])

  if (!src || failed) {
    return (
      <span
        className={`country-flag-fallback ${className}`.trim()}
        style={{
          width: size,
          height: size,
          fontSize: size * 0.7,
        }}
        aria-hidden="true"
      >
        🏳️
      </span>
    )
  }

  return (
    <img
      src={src}
      width={size}
      height={size}
      alt={code ? countryNameFor(code) || code : ''}
      className={`country-flag-img ${className}`.trim()}
      onError={() => setFailed(true)}
      draggable="false"
    />
  )
}

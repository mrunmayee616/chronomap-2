import { useEffect, useState } from 'react'
import { countryNameFor, flagImageUrl } from '../data/countries.js'

// A real flag image for a country code, with a graceful fallback (a plain
// globe-ish placeholder, not a broken-image icon) if the code is missing or
// the image fails to load - e.g. no network reaching flagcdn.com.
<<<<<<< HEAD
=======
//
// Flags render as circles: a size x size square cropped by CSS
// (.country-flag-img) with object-fit: cover, so the centre of the flag -
// where most emblems sit - stays visible.
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
export default function CountryFlag({ code, size = 20, className = '' }) {
  const [failed, setFailed] = useState(false)
  const src = flagImageUrl(code)

  // A different country was selected - give the new flag a fresh chance to
  // load instead of staying stuck on a previous failure.
  useEffect(() => setFailed(false), [code])

  if (!src || failed) {
    return (
      <span
        className={`country-flag-fallback ${className}`.trim()}
<<<<<<< HEAD
        style={{ width: size, height: size * 0.75 }}
=======
        style={{ width: size, height: size, fontSize: size * 0.7 }}
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
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
<<<<<<< HEAD
      height={size * 0.75}
=======
      height={size}
>>>>>>> 3450fa5 (feat: Fixes for admin user and loading accurate images for locations)
      alt={code ? countryNameFor(code) || code : ''}
      className={`country-flag-img ${className}`.trim()}
      onError={() => setFailed(true)}
      draggable="false"
    />
  )
}

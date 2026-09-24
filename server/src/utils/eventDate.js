// Parses one historical date string into { yearStart, yearEnd, dateLabel }.
// Mirrors the parser originally used to build the static dataset, so a CSV
// in the same format (place_name, country, latitude, longitude, event_name,
// event_type, event_date, description) imports the same way.
export function parseEventDate(raw) {
  const s = String(raw).trim()
  let m

  // ISO full date "1947-08-15"
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (m) {
    const y = Number(m[1])
    return { yearStart: y, yearEnd: y, dateLabel: s }
  }

  // ISO year-month "1917-11"
  m = /^(\d{4})-(\d{2})$/.exec(s)
  if (m) {
    const y = Number(m[1])
    return { yearStart: y, yearEnd: y, dateLabel: s }
  }

  // Century range "15th-16th century"
  m = /^(\d+)(?:st|nd|rd|th)-(\d+)(?:st|nd|rd|th) century( CE)?$/.exec(s)
  if (m) {
    const c1 = Number(m[1])
    const c2 = Number(m[2])
    return { yearStart: (c1 - 1) * 100 + 1, yearEnd: c2 * 100, dateLabel: s }
  }

  // Single century "14th century CE"
  m = /^(\d+)(?:st|nd|rd|th) century( CE)?$/.exec(s)
  if (m) {
    const c = Number(m[1])
    return { yearStart: (c - 1) * 100 + 1, yearEnd: c * 100, dateLabel: s }
  }

  // "1200s CE" -> the whole century-decade block (1200-1299)
  m = /^(\d+)00s( CE)?$/.exec(s)
  if (m) {
    const base = Number(`${m[1]}00`)
    return { yearStart: base, yearEnd: base + 99, dateLabel: s }
  }

  // "1920s" -> a literal decade (1920-1929)
  m = /^(\d+)0s( CE)?$/.exec(s)
  if (m) {
    const base = Number(`${m[1]}0`)
    return { yearStart: base, yearEnd: base + 9, dateLabel: s }
  }

  // Approximate "c. 2560 BCE"
  m = /^c\.\s*(\d+)\s*(BCE|CE)?$/.exec(s)
  if (m) {
    const n = Number(m[1])
    const era = m[2] || 'CE'
    const y = era === 'BCE' ? -n : n
    return { yearStart: y, yearEnd: y, dateLabel: s }
  }

  // General range "461-429 BCE" / "1632-1653 CE" / "1945-1946" / "1492-1600s"
  m = /^(\d+)-(\d+)(s)?\s*(BCE|CE)?$/.exec(s)
  if (m) {
    const a = Number(m[1])
    const b = Number(m[2])
    const era = m[4] || 'CE'
    const sign = era === 'BCE' ? -1 : 1
    const ya = sign * a
    const yb = m[3] ? (sign > 0 ? sign * (b + 99) : sign * b) : sign * b
    return { yearStart: Math.min(ya, yb), yearEnd: Math.max(ya, yb), dateLabel: s }
  }

  // Single number with optional era "753 BCE" / "1648"
  m = /^(\d+)\s*(BCE|CE)?$/.exec(s)
  if (m) {
    const n = Number(m[1])
    const era = m[2] || 'CE'
    const y = era === 'BCE' ? -n : n
    return { yearStart: y, yearEnd: y, dateLabel: s }
  }

  throw new Error(`Unrecognized date format: "${s}"`)
}

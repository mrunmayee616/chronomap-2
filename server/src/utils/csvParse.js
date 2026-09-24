// Parses CSV text into an array of row objects keyed by the header row.
// Handles quoted fields, embedded commas/newlines inside quotes, and
// escaped quotes ("" inside a quoted field). Blank trailing lines are
// dropped. No external dependency -- the format is simple enough that a
// small hand-rolled parser is easier to audit than pulling in a library.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  const normalized = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i]

    if (inQuotes) {
      if (ch === '"') {
        if (normalized[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += ch
      }
      continue
    }

    if (ch === '"') {
      inQuotes = true
    } else if (ch === ',') {
      row.push(field)
      field = ''
    } else if (ch === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += ch
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  const nonEmptyRows = rows.filter((r) => r.some((c) => c.trim() !== ''))
  if (nonEmptyRows.length === 0) return []

  const header = nonEmptyRows[0].map((h) => h.trim())
  return nonEmptyRows.slice(1).map((r) => {
    const obj = {}
    header.forEach((h, idx) => {
      obj[h] = (r[idx] ?? '').trim()
    })
    return obj
  })
}

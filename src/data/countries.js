// Canonical list of countries for the registration form and the
// leaderboard's country column. Codes are ISO 3166-1 alpha-2. Keep this in
// sync with server/src/data/countries.js (same codes/names -- duplicated
// because the client and server are separate builds).
export const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CA', name: 'Canada' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' },
  { code: 'EG', name: 'Egypt' },
  { code: 'EE', name: 'Estonia' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GR', name: 'Greece' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KR', name: 'South Korea' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'NO', name: 'Norway' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PA', name: 'Panama' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TR', name: 'Turkey' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
]

export const COUNTRY_CODES = COUNTRIES.map((c) => c.code)

/**
 * Maps each country's ISO 3166-1 alpha-2 code to the interface language
 * that best matches its most-spoken / official language.
 * Only the four languages the app supports (en, fr, es, de) are used;
 * countries whose primary language is not among those fall back to 'en'.
 *
 * Rules applied:
 *  - If a country has more than one official/widely-spoken language, the
 *    most-used one is chosen.
 *  - No language code is stored more than once per country.
 */
export const COUNTRY_LANGUAGE_MAP = {
  AF: 'en', // Dari/Pashto → en fallback
  AL: 'en', // Albanian → en fallback
  DZ: 'ar', // Arabic (primary spoken language)
  AR: 'es', // Spanish
  AM: 'en', // Armenian → en fallback
  AU: 'en', // English
  AT: 'de', // German
  AZ: 'ru', // Russian widely used alongside Azerbaijani
  BD: 'en', // Bengali → en fallback
  BE: 'fr', // French (largest community; also Dutch/German)
  BR: 'pt', // Portuguese
  BG: 'en', // Bulgarian → en fallback
  KH: 'en', // Khmer → en fallback
  CA: 'en', // English (most spoken; also French)
  CL: 'es', // Spanish
  CN: 'zh', // Mandarin Chinese
  CO: 'es', // Spanish
  CR: 'es', // Spanish
  HR: 'en', // Croatian → en fallback
  CU: 'es', // Spanish
  CZ: 'en', // Czech → en fallback
  DK: 'sv', // Nordic — Swedish is the closest supported language
  EG: 'ar', // Arabic
  EE: 'en', // Estonian → en fallback
  ET: 'en', // Amharic → en fallback
  FI: 'sv', // Swedish is an official language; Finnish unsupported
  FR: 'fr', // French
  GE: 'en', // Georgian → en fallback
  DE: 'de', // German
  GH: 'en', // English
  GR: 'el', // Greek
  HK: 'zh', // Cantonese / Mandarin Chinese
  HU: 'en', // Hungarian → en fallback
  IS: 'sv', // Nordic — Swedish closest supported
  IN: 'hi', // Hindi (most spoken)
  ID: 'id', // Indonesian
  IR: 'en', // Persian → en fallback
  IQ: 'ar', // Arabic
  IE: 'en', // English
  IL: 'en', // Hebrew → en fallback
  IT: 'it', // Italian
  JM: 'en', // English
  JP: 'ja', // Japanese
  JO: 'ar', // Arabic
  KZ: 'ru', // Russian widely used alongside Kazakh
  KE: 'en', // Swahili/English → en
  KR: 'ko', // Korean
  KW: 'ar', // Arabic
  LV: 'en', // Latvian → en fallback
  LB: 'ar', // Arabic (primary); French also common
  LT: 'en', // Lithuanian → en fallback
  MY: 'id', // Malay — Indonesian is closely related and supported
  MX: 'es', // Spanish
  MA: 'ar', // Arabic (primary spoken language)
  MM: 'en', // Burmese → en fallback
  NP: 'en', // Nepali → en fallback
  NL: 'nl', // Dutch
  NZ: 'en', // English
  NG: 'en', // English
  NO: 'sv', // Norwegian — Swedish closely related and supported
  PK: 'en', // Urdu/English → en
  PA: 'es', // Spanish
  PE: 'es', // Spanish
  PH: 'en', // Filipino/English → en
  PL: 'pl', // Polish
  PT: 'pt', // Portuguese
  QA: 'ar', // Arabic
  RO: 'ro', // Romanian
  RU: 'ru', // Russian
  SA: 'ar', // Arabic
  RS: 'en', // Serbian → en fallback
  SG: 'zh', // Mandarin Chinese (largest linguistic community)
  SK: 'en', // Slovak → en fallback
  SI: 'en', // Slovenian → en fallback
  ZA: 'en', // English (most used of 11 official languages)
  ES: 'es', // Spanish
  LK: 'en', // Sinhala/Tamil → en fallback
  SE: 'sv', // Swedish
  CH: 'de', // German (most spoken; also French/Italian)
  TW: 'zh', // Mandarin Chinese
  TH: 'en', // Thai → en fallback
  TR: 'tr', // Turkish
  UA: 'uk', // Ukrainian
  AE: 'ar', // Arabic (official); English widely used
  GB: 'en', // English
  US: 'en', // English
  UY: 'es', // Spanish
  UZ: 'ru', // Russian widely used alongside Uzbek
  VE: 'es', // Spanish
  VN: 'en', // Vietnamese → en fallback
}

const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]))

export function countryNameFor(code) {
  return COUNTRY_BY_CODE.get(code)?.name || ''
}

// Turns an ISO 3166-1 alpha-2 code into its flag emoji by mapping each
// letter to its "regional indicator symbol" codepoint (U+1F1E6 = 'A').
// Kept as a plain-text fallback (used in <img alt> text, for example) --
// NOT used for the actual on-screen flag anymore. Many Windows browser/font
// combinations don't compose these two-letter pairs into a flag glyph at
// all and instead print the raw two letters (e.g. "US"), which is exactly
// the "flag doesn't appear" bug this file's flagImageUrl() below fixes by
// using a real flag image instead.
export function flagEmojiFor(code) {
  if (!code || code.length !== 2) return '🏳️'
  const chars = code
    .toUpperCase()
    .split('')
    .map((ch) => 127397 + ch.charCodeAt(0))
  return String.fromCodePoint(...chars)
}

// A real flag image (SVG), from flagcdn.com -- a free CDN of public-domain
// flag artwork keyed by the same ISO 3166-1 alpha-2 codes already used
// throughout this file. Renders identically on every OS/browser, unlike the
// emoji flags above. See src/components/CountryFlag.jsx for the component
// that displays this with a graceful fallback if the request fails.
export function flagImageUrl(code) {
  if (!code || code.length !== 2) return null
  return `https://flagcdn.com/${code.toLowerCase()}.svg`
}

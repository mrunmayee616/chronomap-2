import { AVATAR_PRESETS, avatarUrlFor } from '../lib/avatar.js'

// A grid of avatars to choose from. The first tile is the default initials
// avatar (value ''), the rest are the presets in src/lib/avatar.js.
// `seed` is the username/name used to draw the initials tile.
export default function AvatarPicker({ value, onChange, seed }) {
  const options = [{ id: '', label: 'Initials' }, ...AVATAR_PRESETS]

  return (
    <div className="avatar-picker" role="radiogroup" aria-label="Choose your avatar">
      {options.map((opt) => {
        const selected = (value || '') === opt.id
        return (
          <button
            key={opt.id || 'initials'}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={opt.label}
            title={opt.label}
            className={selected ? 'avatar-picker-option selected' : 'avatar-picker-option'}
            onClick={() => onChange(opt.id)}
          >
            <img src={avatarUrlFor(seed, opt.id)} alt="" />
          </button>
        )
      })}
    </div>
  )
}

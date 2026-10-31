import ProfessorOwl from './ProfessorOwl.jsx'

// Professor Owl with a little speech bubble -- used for friendly empty
// states ("nothing here yet") so they read as a hint, not a dead end.
export default function OwlNote({ children, className = '' }) {
  return (
    <div className={`owl-note ${className}`}>
      <span className="owl-note-owl" aria-hidden="true">
        <ProfessorOwl size={56} />
      </span>
      <div className="owl-note-bubble">{children}</div>
    </div>
  )
}

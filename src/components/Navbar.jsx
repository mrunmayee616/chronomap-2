import { Link } from 'react-router-dom'

const NAV_ITEMS = ['Home', 'Explore', 'Timeline', 'Quiz', 'Leaderboard', 'About']

function noop(e) {
  e.preventDefault()
}

export default function Navbar({ active = 'Home' }) {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>ChronoMap</span>
      </div>

      <div className="nav-links">
        {NAV_ITEMS.map((item) =>
          item === 'Home' ? (
            <Link
              key={item}
              to="/"
              className={item === active ? 'active' : ''}
            >
              {item}
            </Link>
          ) : (
            <a
              key={item}
              href="#"
              className={item === active ? 'active' : ''}
              onClick={noop}
            >
              {item}
            </a>
          )
        )}
      </div>

      <Link
        to="/signin"
        className={active === 'Sign In' ? 'btn-signin active' : 'btn-signin'}
      >
        Sign In
      </Link>
    </nav>
  )
}

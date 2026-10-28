import { BsMoonStars, BsSun } from 'react-icons/bs'

function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === 'dark' ? <BsSun size={18} aria-hidden="true" /> : <BsMoonStars size={17} aria-hidden="true" />}
    </button>
  )
}

export default ThemeToggle

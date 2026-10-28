const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const scoreLevel = (score) => (score >= 80 ? 'good' : score >= 50 ? 'ok' : 'poor')

export const scoreLabel = (score) =>
  score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 50 ? 'Needs work' : 'Poor'

function ScoreRing({ score }) {
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className={`score-ring score--${scoreLevel(score)}`} role="img" aria-label={`SEO score ${score} out of 100`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="score-ring__track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="score-ring__value"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="score-ring__number" aria-hidden="true">
        {score}
        <span>/100</span>
      </div>
    </div>
  )
}

export default ScoreRing

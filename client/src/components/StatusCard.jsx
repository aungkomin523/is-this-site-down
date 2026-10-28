import { Card } from 'react-bootstrap'

// 'london' -> 'London', 'new-york' -> 'New York'
const formatRegion = (region = '') =>
  region
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

function StatusCard(props) {
  const { status, resTime } = props
  const region = formatRegion(props.region)

  return (
    <Card className={`status-card ${status ? 'status-card--up' : 'status-card--down'}`}>
      <Card.Header className="status-card__header">
        <div className="region-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="region-icon"
            aria-hidden="true"
          >
            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
          </svg>
          <span className="region-name">{region}</span>
        </div>

        <div className={`status-pill ${status ? 'status-pill--up' : 'status-pill--down'}`}>
          <span className="status-dot" />
          {status ? 'Operational' : 'Down'}
        </div>
      </Card.Header>

      <Card.Body className="status-card__body">
        <div className="status-headline">
          <div className={`status-icon ${status ? 'status-icon--up' : 'status-icon--down'}`}>
            {status ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.485 1.929a.75.75 0 0 1 .03 1.06l-7 7.5a.75.75 0 0 1-1.09.02l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.945 2.944 6.494-6.958a.75.75 0 0 1 1.06-.006" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
              </svg>
            )}
          </div>

          <div>
            <div className={`status-label ${status ? 'status-label--up' : 'status-label--down'}`}>
              {status ? 'UP' : 'DOWN'}
            </div>
            <div className="status-sublabel">
              {status ? 'Reachable from this region' : 'Unreachable from this region'}
            </div>
          </div>
        </div>

        <div className="status-stats">
          <div className="stat">
            <span className="stat-label">Response time</span>
            <span className={`stat-value ${status ? 'stat-value--up' : 'stat-value--down'}`}>
              {resTime}
            </span>
          </div>
        </div>

        <p className="status-description">
          {status
            ? `Users in ${region} can access the website normally.`
            : `Users in ${region} are currently unable to reach the website.`}
        </p>
      </Card.Body>

    </Card>
  )
}

export default StatusCard
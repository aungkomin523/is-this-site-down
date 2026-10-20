import { Card } from 'react-bootstrap'

function StatusCard(props) {
  const { region, status, resTime } = props

  return (
    <Card className={`status-card ${status ? 'status-card--up' : 'status-card--down'}`}>
      <div className="status-card__glow" aria-hidden="true" />

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

      <style>{`
        .status-card {
          position: relative;
          overflow: hidden;
          background: rgba(30, 41, 59, 0.7) !important;
          border: 1px solid rgba(148, 163, 184, 0.12) !important;
          border-radius: 18px !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #e2e8f0;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
          height: 100%;
        }

        .status-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px -16px rgba(0, 0, 0, 0.6);
        }

        .status-card--up:hover {
          border-color: rgba(34, 197, 94, 0.4) !important;
        }

        .status-card--down:hover {
          border-color: rgba(239, 68, 68, 0.4) !important;
        }

        .status-card__glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(40px);
          opacity: 0.35;
        }

        .status-card--up .status-card__glow {
          background: radial-gradient(circle, rgba(34, 197, 94, 0.6), transparent 70%);
        }

        .status-card--down .status-card__glow {
          background: radial-gradient(circle, rgba(239, 68, 68, 0.6), transparent 70%);
        }

        .status-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 20px !important;
          background: rgba(15, 23, 42, 0.4) !important;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1) !important;
        }

        .region-info {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #cbd5e1;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .region-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .region-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .status-pill--up {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-pill--down {
          background: rgba(239, 68, 68, 0.12);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 0 currentColor;
          animation: statusPulse 2s infinite;
        }

        @keyframes statusPulse {
          0% { box-shadow: 0 0 0 0 rgba(134, 239, 172, 0.6); }
          70% { box-shadow: 0 0 0 6px rgba(134, 239, 172, 0); }
          100% { box-shadow: 0 0 0 0 rgba(134, 239, 172, 0); }
        }

        .status-card--down .status-dot {
          animation-name: statusPulseDown;
        }

        @keyframes statusPulseDown {
          0% { box-shadow: 0 0 0 0 rgba(252, 165, 165, 0.6); }
          70% { box-shadow: 0 0 0 6px rgba(252, 165, 165, 0); }
          100% { box-shadow: 0 0 0 0 rgba(252, 165, 165, 0); }
        }

        .status-card__body {
          padding: 20px !important;
          position: relative;
          z-index: 1;
        }

        .status-headline {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .status-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .status-icon--up {
          background: rgba(34, 197, 94, 0.12);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .status-icon--down {
          background: rgba(239, 68, 68, 0.12);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .status-label {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .status-label--up {
          color: #4ade80;
        }

        .status-label--down {
          color: #f87171;
        }

        .status-sublabel {
          font-size: 0.8rem;
          color: #94a3b8;
          margin-top: 2px;
        }

        .status-stats {
          display: flex;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.1);
          margin-bottom: 14px;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
          width: 100%;
        }

        .stat-label {
          font-size: 0.72rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }

        .stat-value {
          font-size: 1.05rem;
          font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        .stat-value--up {
          color: #86efac;
        }

        .stat-value--down {
          color: #fca5a5;
        }

        .status-description {
          margin: 0;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #94a3b8;
        }

        @media (max-width: 576px) {
          .status-card__header {
            padding: 12px 16px !important;
          }

          .status-card__body {
            padding: 16px !important;
          }

          .status-label {
            font-size: 1.2rem;
          }

          .status-icon {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>
    </Card>
  )
}

export default StatusCard
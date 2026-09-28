import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="notfound-wrapper">
      <Container className="notfound-container text-center">
        <div className="notfound-badge">
          <span className="pulse-dot" />
          Error 404
        </div>

        <h1 className="notfound-code" aria-hidden="true">404</h1>

        <h2 className="notfound-title">Page not found</h2>
        <p className="notfound-text">
          The page you requested doesn't exist, was moved, or is temporarily
          unavailable. Let's get you back on track.
        </p>

        <div className="notfound-actions">
          <Button as={Link} to="/" className="btn-home">
            Return home
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="ms-2"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
              />
            </svg>
          </Button>

          <Button as={Link} to="/" className="btn-secondary-link">
            Check a website
          </Button>
        </div>
      </Container>

      <style>{`
        .notfound-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 60%);
          color: #e2e8f0;
          position: relative;
          overflow: hidden;
        }

        .notfound-wrapper::before {
          content: '';
          position: absolute;
          top: -40%;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .notfound-container {
          position: relative;
          z-index: 1;
          max-width: 640px;
        }

        .notfound-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }

        .notfound-code {
          font-size: clamp(5rem, 18vw, 10rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.05em;
          margin: 0;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 20px 40px rgba(99, 102, 241, 0.25));
        }

        .notfound-title {
          font-size: clamp(1.4rem, 4vw, 2rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f1f5f9;
          margin: 8px 0 12px;
        }

        .notfound-text {
          font-size: 1rem;
          line-height: 1.6;
          color: #94a3b8;
          max-width: 480px;
          margin: 0 auto 32px;
        }

        .notfound-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .btn-home {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          border: none !important;
          border-radius: 12px !important;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
          color: #fff !important;
          transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease !important;
          box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.6);
        }

        .btn-home:hover {
          transform: translateY(-1px);
          filter: brightness(1.1);
          box-shadow: 0 14px 34px -10px rgba(99, 102, 241, 0.75);
        }

        .btn-home:active {
          transform: translateY(0);
        }

        .btn-secondary-link {
          display: inline-flex;
          align-items: center;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          font-size: 0.95rem !important;
          border-radius: 12px !important;
          background: rgba(148, 163, 184, 0.08) !important;
          border: 1px solid rgba(148, 163, 184, 0.2) !important;
          color: #cbd5e1 !important;
          transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
        }

        .btn-secondary-link:hover {
          background: rgba(148, 163, 184, 0.14) !important;
          border-color: rgba(148, 163, 184, 0.35) !important;
          color: #f1f5f9 !important;
        }
      `}</style>
    </div>
  )
}

export default NotFoundPage
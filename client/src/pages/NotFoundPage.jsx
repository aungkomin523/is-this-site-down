import { useEffect } from 'react'
import { Button, Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  // Tell search engines not to index 404 pages, and give the tab a clear title
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Page not found | Up or Not?'

    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex'
    document.head.appendChild(robots)

    return () => {
      document.title = previousTitle
      robots.remove()
    }
  }, [])

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

    </div>
  )
}

export default NotFoundPage
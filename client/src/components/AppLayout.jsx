import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

function AppLayout() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    setExpanded(false)
  }, [location.pathname])

  return (
    <div className="app-layout d-flex flex-column min-vh-100">
      <Navbar
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        className={`app-navbar ${scrolled ? 'app-navbar--scrolled' : ''}`}
      >
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-pulse" />
            </span>
            <span className="brand-text">
              <span className="brand-accent">Up</span> or Not?
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navigation" className="nav-toggle">
            <span className="toggle-bar" />
            <span className="toggle-bar" />
            <span className="toggle-bar" />
          </Navbar.Toggle>

          <Navbar.Collapse id="main-navigation">
            <Nav className="ms-auto align-items-lg-center nav-links">
              <Nav.Link as={NavLink} to="/" end className="nav-link-item">
                Home
              </Nav.Link>
              {/* <Nav.Link as={NavLink} to="/history" className="nav-link-item">
                Status History
              </Nav.Link>
              <Nav.Link as={NavLink} to="/map" className="nav-link-item">
                Outage Map
              </Nav.Link>
              <Nav.Link as={NavLink} to="/support" className="nav-link-item">
                Support
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="app-footer">
        <Container className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span>© {new Date().getFullYear()} Is This Site Down?</span>
          <span className="footer-status">
            <span className="footer-dot" />
            All systems operational
          </span>
        </Container>
      </footer>

      <style>{`
        .app-layout {
          background: #0f172a;
        }

        .app-navbar {
          position: sticky;
          top: 0;
          z-index: 1030;
          padding: 14px 0;
          background: rgba(15, 23, 42, 0.7) !important;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(148, 163, 184, 0.08);
          transition: padding 0.25s ease, background 0.25s ease,
                      border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .app-navbar--scrolled {
          padding: 8px 0;
          background: rgba(15, 23, 42, 0.9) !important;
          border-bottom-color: rgba(148, 163, 184, 0.15);
          box-shadow: 0 10px 30px -12px rgba(0, 0, 0, 0.5);
        }

        /* Brand */
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
          color: #e2e8f0 !important;
          text-decoration: none;
          padding: 0;
        }

        .brand-mark {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 9px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 6px 16px -6px rgba(99, 102, 241, 0.7);
          flex-shrink: 0;
        }

        .brand-pulse {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8);
          animation: brandPulse 2s infinite;
        }

        @keyframes brandPulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.8); }
          70% { box-shadow: 0 0 0 8px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }

        .brand-accent {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Nav links */
        .nav-links {
          gap: 4px;
          margin-top: 12px;
        }

        @media (min-width: 992px) {
          .nav-links {
            margin-top: 0;
          }
        }

        .nav-link-item {
          position: relative;
          color: #94a3b8 !important;
          font-size: 0.95rem;
          font-weight: 500;
          padding: 8px 14px !important;
          border-radius: 10px;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .nav-link-item:hover {
          color: #e2e8f0 !important;
          background: rgba(148, 163, 184, 0.08);
        }

        .nav-link-item.active {
          color: #e2e8f0 !important;
          background: rgba(99, 102, 241, 0.12);
        }

        .nav-link-item.active::after {
          content: '';
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 2px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366f1, #a855f7);
        }

        /* Custom toggle (hamburger) */
        .nav-toggle {
          border: none !important;
          box-shadow: none !important;
          padding: 8px !important;
          display: inline-flex;
          flex-direction: column;
          gap: 5px;
          background: transparent !important;
        }

        .nav-toggle:focus {
          box-shadow: none !important;
        }

        .toggle-bar {
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: #cbd5e1;
          transition: transform 0.25s ease, opacity 0.25s ease;
        }

        .nav-toggle[aria-expanded='true'] .toggle-bar:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .nav-toggle[aria-expanded='true'] .toggle-bar:nth-child(2) {
          opacity: 0;
        }

        .nav-toggle[aria-expanded='true'] .toggle-bar:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Mobile menu card */
        @media (max-width: 991.98px) {
          .navbar-collapse {
            margin-top: 12px;
            padding: 8px;
            border-radius: 14px;
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(148, 163, 184, 0.12);
            backdrop-filter: blur(14px);
          }
        }

        /* Footer */
        .app-footer {
          padding: 20px 0;
          background: rgba(15, 23, 42, 0.9);
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .footer-status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #86efac;
        }

        .footer-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          animation: brandPulse 2s infinite;
        }
      `}</style>
    </div>
  )
}

export default AppLayout
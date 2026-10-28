import { useEffect, useState } from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'

function AppLayout() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

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

          <div className="nav-actions order-lg-last ms-lg-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <Navbar.Toggle aria-controls="main-navigation" className="nav-toggle">
              <span className="toggle-bar" />
              <span className="toggle-bar" />
              <span className="toggle-bar" />
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="main-navigation">
            <Nav className="ms-auto align-items-lg-center nav-links">
              <Nav.Link as={NavLink} to="/" end className="nav-link-item">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/seo" className="nav-link-item">
                SEO Check
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
          <span>© {new Date().getFullYear()} Up or Not?</span>
          <span className="footer-status">
            <span className="footer-dot" />
            All systems operational
          </span>
        </Container>
      </footer>

    </div>
  )
}

export default AppLayout
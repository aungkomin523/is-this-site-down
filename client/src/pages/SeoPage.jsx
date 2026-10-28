import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Container, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import { BsCheck2 } from 'react-icons/bs'
import SeoCheckItem from '../components/SeoCheckItem'
import SerpPreview from '../components/SerpPreview'
import { usePageMeta } from '../hooks/usePageMeta'
import api from '../services/api'
import { normalizeUrl } from '../utils/url'

const scoreLevel = (score) => (score >= 80 ? 'good' : score >= 50 ? 'ok' : 'poor')

const scoreLabel = (score) =>
  score >= 90 ? 'Excellent' : score >= 80 ? 'Good' : score >= 50 ? 'Needs work' : 'Poor'

const scoreMessage = (failed, warnings) => {
  if (failed === 0 && warnings === 0) return 'This page covers all the SEO essentials.'
  const parts = []
  if (failed) parts.push(`${failed} critical ${failed === 1 ? 'issue' : 'issues'}`)
  if (warnings) parts.push(`${warnings} ${warnings === 1 ? 'warning' : 'warnings'}`)
  return `${parts.join(' and ')} to fix.`
}

function SeoPage() {
  usePageMeta({
    title: 'Free SEO Checker – Score any web page | Up or Not?',
    description:
      'Check any web page for essential on-page SEO: title, meta description, canonical, Open Graph, robots.txt, sitemap and more. Get a score out of 100 with fix tips.',
    canonical: 'https://upornot.dev/seo',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const queryUrl = searchParams.get('url') || ''

  const [url, setUrl] = useState(queryUrl)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const latestRequest = useRef(0) // ignore answers from older requests

  const runCheck = useCallback(async (target) => {
    const requestId = ++latestRequest.current
    setLoading(true)
    setError('')
    setReport(null)

    try {
      const response = await api.post('/seo', { url: target })
      if (requestId === latestRequest.current) setReport(response.data)
    } catch (err) {
      if (requestId === latestRequest.current) {
        setError(err.response?.data?.error || err.message || 'Failed to check SEO')
      }
    } finally {
      if (requestId === latestRequest.current) setLoading(false)
    }
  }, [])

  // Runs when the page opens with ?url=... (e.g. from the home page link)
  useEffect(() => {
    if (queryUrl) {
      setUrl(queryUrl)
      runCheck(queryUrl)
    }
  }, [queryUrl, runCheck])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!url.trim()) {
      setError('Please enter a website URL.')
      return
    }
    const target = normalizeUrl(url)
    // Putting the URL in the address bar makes results shareable
    if (target === queryUrl) runCheck(target)
    else setSearchParams({ url: target })
  }

  const checks = report?.checks ?? []
  const failed = checks.filter((c) => c.status === 'fail')
  const warnings = checks.filter((c) => c.status === 'warn')
  const passed = checks.filter((c) => c.status === 'pass')
  const issues = [...failed, ...warnings] // most important first
  const level = report ? scoreLevel(report.score) : 'ok'

  return (
    <div className="homepage-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center text-center py-lg-5">
          <Col lg={9} xl={8}>
            <div className="hero-badge mb-4">
              On-page SEO analysis
            </div>

            <h1 className="hero-title mb-4">
              SEO Checker
              <span className="hero-subtitle d-block mt-2">
                Score any web page and see exactly what to fix
              </span>
            </h1>

            <Form onSubmit={handleSubmit} className="hero-form" role="search">
              <Form.Label htmlFor="seo-url-input" className="visually-hidden">
                Website URL
              </Form.Label>
              <InputGroup className="search-group">
                <span className="input-icon" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                  </svg>
                </span>

                <Form.Control
                  id="seo-url-input"
                  className="search-input"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="go"
                  placeholder="example.com"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  disabled={loading}
                />

                <Button className="check-button" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      Analysing
                    </>
                  ) : (
                    'Check SEO'
                  )}
                </Button>
              </InputGroup>
            </Form>

            {error && (
              <div className="error-alert mt-3" role="alert">
                {error}
              </div>
            )}

            {!loading && !error && !report && (
              <p className="hint-text mt-3">
                Checks the title, meta description, canonical, robots rules, Open Graph, structured data, robots.txt
                and sitemap.
              </p>
            )}
          </Col>
        </Row>

        {report && (
          <div className="seo-results mt-4" aria-live="polite">
            {/* 1. Overview: score + breakdown */}
            <Card className="seo-card mb-4">
              <Card.Body className="seo-overview">
                <div className="seo-overview__score">
                  <div className={`seo-score score--${level}`}>
                    {report.score}
                    <span>/100</span>
                  </div>
                  <span className={`seo-grade seo-grade--${level}`}>{scoreLabel(report.score)}</span>
                </div>

                <div className="seo-overview__detail">
                  <p className="seo-overview__message">{scoreMessage(failed.length, warnings.length)}</p>
                  <p className="seo-overview__url" title={report.finalUrl}>
                    {report.finalUrl}
                  </p>

                  <div
                    className="seo-bar"
                    role="img"
                    aria-label={`${passed.length} passed, ${warnings.length} warnings, ${failed.length} failed`}
                  >
                    {passed.length > 0 && <span className="seo-bar__seg seo-bar__seg--pass" style={{ flexGrow: passed.length }} />}
                    {warnings.length > 0 && <span className="seo-bar__seg seo-bar__seg--warn" style={{ flexGrow: warnings.length }} />}
                    {failed.length > 0 && <span className="seo-bar__seg seo-bar__seg--fail" style={{ flexGrow: failed.length }} />}
                  </div>

                  <ul className="seo-legend">
                    <li className="seo-legend__item seo-legend__item--pass">
                      <strong>{passed.length}</strong> passed
                    </li>
                    <li className="seo-legend__item seo-legend__item--warn">
                      <strong>{warnings.length}</strong> warnings
                    </li>
                    <li className="seo-legend__item seo-legend__item--fail">
                      <strong>{failed.length}</strong> failed
                    </li>
                  </ul>

                  {report.cached && <p className="seo-cached">Cached result · checked within the last hour</p>}
                </div>
              </Card.Body>
            </Card>

            <Row className="g-4">
              {/* 2. What to fix - the most important part */}
              <Col lg={7}>
                <Card className="seo-card">
                  <Card.Header className="seo-card__header">
                    <h2 className="seo-card__title">Needs attention</h2>
                    <span className="seo-card__count">{issues.length}</span>
                  </Card.Header>
                  {issues.length > 0 ? (
                    <ul className="seo-issue-list">
                      {issues.map((check) => (
                        <SeoCheckItem key={check.name} check={check} />
                      ))}
                    </ul>
                  ) : (
                    <p className="seo-empty">Nothing to fix. Nice work.</p>
                  )}
                </Card>
              </Col>

              {/* 3. Google preview + passed checks */}
              <Col lg={5}>
                <div className="d-flex flex-column gap-4">
                  <SerpPreview
                    url={report.finalUrl}
                    title={report.page?.title || ''}
                    description={report.page?.description || ''}
                  />

                  <Card className="seo-card">
                    <Card.Header className="seo-card__header">
                      <h2 className="seo-card__title">Passed</h2>
                      <span className="seo-card__count">{passed.length}</span>
                    </Card.Header>
                    <ul className="seo-passed">
                      {passed.map((check) => (
                        <li key={check.name}>
                          <BsCheck2 className="seo-passed__icon" size={16} aria-hidden="true" />
                          <span className="seo-passed__name">{check.name}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Link to={`/?url=${encodeURIComponent(report.finalUrl)}`} className="seo-link text-center">
                    Check if this site is up →
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </div>
  )
}

export default SeoPage

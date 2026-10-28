import { useCallback, useEffect, useState } from 'react'
import { Col, Container, Form, InputGroup, Button, Row, Spinner } from 'react-bootstrap'
import { Link, useSearchParams } from 'react-router-dom'
import StatusCard from '../components/StatusCard'
import FaqSection from '../components/FaqSection'
import api from '../services/api'
import { normalizeUrl } from '../utils/url'

function HomePage() {
    const [searchParams] = useSearchParams()
    const queryUrl = searchParams.get('url') || ''

    const [url, setUrl] = useState(queryUrl)
    const [checkedUrl, setCheckedUrl] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const checkStatus = useCallback(async (target) => {
        setLoading(true)
        setError('')
        setResults([])

        try {
            const response = await api.post('/check', {
                url: target,
            })

            setResults(response.data)
            setCheckedUrl(target)
        } catch (error) {
            setError(
                error.response?.data?.error ||
                error.message ||
                'Failed to check website'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    // Runs when opened with ?url=... (e.g. from the SEO page link)
    useEffect(() => {
        if (queryUrl) {
            setUrl(queryUrl)
            checkStatus(queryUrl)
        }
    }, [queryUrl, checkStatus])

    const handleSubmit = (event) => {
        event.preventDefault()
        if (!url.trim()) {
            setError('Please enter a website URL.')
            return
        }
        checkStatus(normalizeUrl(url))
    }

    return (
        <div className="homepage-wrapper">
            <Container className="py-5">
                <Row className="justify-content-center text-center py-lg-5">
                    <Col lg={9} xl={8}>
                        <div className="hero-badge mb-4">
                            Real-time uptime monitoring
                        </div>

                        <h1 className="hero-title mb-4">
                            Up or Not?
                            <span className="hero-subtitle d-block mt-2">
                                Check the status of any website or service
                            </span>
                        </h1>

                        <Form onSubmit={handleSubmit} className="hero-form" role="search">
                            <Form.Label htmlFor="url-input" className="visually-hidden">
                                Website URL
                            </Form.Label>
                            <InputGroup className="search-group">
                                <span className="input-icon" aria-hidden="true">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M4.5 7.5a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1z" />
                                    </svg>
                                </span>

                                <Form.Control
                                    id="url-input"
                                    className="search-input"
                                    type="text"
                                    inputMode="url"
                                    autoComplete="url"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    enterKeyHint="go"
                                    placeholder="example.com"
                                    aria-label="Enter website URL"
                                    value={url}
                                    onChange={(event) => setUrl(event.target.value)}
                                    disabled={loading}
                                />

                                <Button
                                    className="check-button"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                className="me-2"
                                            />
                                            Checking
                                        </>
                                    ) : (
                                        <>
                                            Check Status
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
                                        </>
                                    )}
                                </Button>
                            </InputGroup>
                        </Form>

                        {error && (
                            <div className="error-alert mt-3" role="alert">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="me-2"
                                    aria-hidden="true"
                                >
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {!loading && !error && results.length === 0 && (
                            <p className="hint-text mt-3">
                                Enter a URL above to check its availability across multiple regions.
                                <br />
                                Want to improve your search ranking? Try the{' '}
                                <Link to="/seo" className="seo-link">SEO checker</Link>.
                            </p>
                        )}
                    </Col>
                </Row>

                {results.length > 0 && (
                    <Row className="justify-content-center mt-4 g-4" aria-live="polite">
                        {results.map((result) => (
                            <Col md={6} lg={4} key={result.region}>
                                <StatusCard
                                    status={result.status === 'UP'}
                                    region={result.region}
                                    resTime={
                                        result.responseTime
                                            ? `${result.responseTime}ms`
                                            : '-'
                                    }
                                />
                            </Col>
                        ))}
                    </Row>
                )}

                {results.length > 0 && checkedUrl && (
                    <p className="text-center mt-4 mb-0">
                        <Link to={`/seo?url=${encodeURIComponent(checkedUrl)}`} className="seo-link">
                            See the SEO score for this site →
                        </Link>
                    </p>
                )}

                <FaqSection />
            </Container>

        </div>
    )
}

export default HomePage
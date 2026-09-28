import { useState } from 'react'
import { Col, Container, Form, InputGroup, Button, Row, Spinner } from 'react-bootstrap'
import StatusCard from '../components/StatusCard'
import api from '../services/api'
function HomePage() {
    const [url, setUrl] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const checkStatus = async () => {
        if (!url.trim()) {
            setError('Please enter a website URL.')
            return
        }

        setLoading(true)
        setError('')
        setResults([])

        try {
            const response = await api.post('/check', {
                url: url.trim(),
            })

            setResults(response.data)
        } catch (error) {
            setError(
                error.response?.data?.error ||
                error.message ||
                'Failed to check website'
            )
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        checkStatus()
    }

    return (
        <div className="homepage-wrapper">
            <Container className="py-5">
                <Row className="justify-content-center text-center py-lg-5">
                    <Col lg={9} xl={8}>
                        <div className="hero-badge mb-4">
                            <span className="pulse-dot" />
                            Real-time uptime monitoring
                        </div>

                        <h1 className="hero-title mb-4">
                            Up or Not?
                            <span className="hero-subtitle d-block mt-2">
                                Check the status of any website or service
                            </span>
                        </h1>

                        <Form onSubmit={handleSubmit} className="hero-form">
                            <InputGroup className="search-group">
                                <span className="input-icon">
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
                                    className="search-input"
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
                            <div className="error-alert mt-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    className="me-2"
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
                            </p>
                        )}
                    </Col>
                </Row>

                {results.length > 0 && (
                    <Row className="justify-content-center mt-4 g-4">
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
            </Container>

            <style>{`
                .homepage-wrapper {
                    min-height: 100vh;
                    background: radial-gradient(circle at 50% 0%, #1e293b 0%, #0f172a 60%);
                    color: #e2e8f0;
                    position: relative;
                    overflow: hidden;
                }

                .homepage-wrapper::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 800px;
                    height: 800px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 16px;
                    border-radius: 999px;
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    color: #a5b4fc;
                    font-size: 0.85rem;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                }

                .pulse-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #22c55e;
                    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }

                .hero-title {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    line-height: 1.1;
                    background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    font-size: clamp(1rem, 2.5vw, 1.35rem);
                    font-weight: 400;
                    color: #94a3b8;
                    letter-spacing: -0.01em;
                }

                .search-group {
                    background: rgba(30, 41, 59, 0.8);
                    border: 1px solid rgba(148, 163, 184, 0.15);
                    border-radius: 16px;
                    padding: 6px;
                    backdrop-filter: blur(12px);
                    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                    display: flex;
                    align-items: center;
                }

                .search-group:focus-within {
                    border-color: rgba(99, 102, 241, 0.6);
                    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4),
                                0 0 0 4px rgba(99, 102, 241, 0.15);
                }

                .input-icon {
                    display: flex;
                    align-items: center;
                    padding-left: 14px;
                    color: #64748b;
                }

                .search-input {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    color: #e2e8f0 !important;
                    font-size: 1rem;
                    padding: 14px 12px;
                }

                .search-input::placeholder {
                    color: #64748b;
                }

                .check-button {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
                    border: none !important;
                    border-radius: 12px !important;
                    padding: 12px 24px !important;
                    font-weight: 600 !important;
                    font-size: 0.95rem !important;
                    letter-spacing: 0.01em;
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                    transition: transform 0.15s ease, filter 0.15s ease !important;
                }

                .check-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    filter: brightness(1.1);
                }

                .check-button:active:not(:disabled) {
                    transform: translateY(0);
                }

                .check-button:disabled {
                    opacity: 0.7;
                }

                .error-alert {
                    display: inline-flex;
                    align-items: center;
                    padding: 10px 18px;
                    border-radius: 12px;
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #fca5a5;
                    font-size: 0.9rem;
                }

                .hint-text {
                    color: #64748b;
                    font-size: 0.9rem;
                }

                @media (max-width: 576px) {
                    .check-button {
                        padding: 12px 16px !important;
                        font-size: 0.85rem !important;
                    }

                    .check-button svg {
                        display: none;
                    }

                    .search-input {
                        padding: 12px 8px;
                    }
                }
            `}</style>
        </div>
    )
}

export default HomePage
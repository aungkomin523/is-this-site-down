import { Card } from 'react-bootstrap'

const truncate = (text, max) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text)

// Roughly how the page appears in Google search results
function SerpPreview({ url, title, description }) {
  let host = url
  let breadcrumb = ''
  try {
    const parsed = new URL(url)
    host = parsed.hostname.replace(/^www\./, '')
    breadcrumb = parsed.pathname.split('/').filter(Boolean).join(' › ')
  } catch {
    // keep the raw URL
  }

  return (
    <Card className="seo-card">
      <Card.Header className="seo-card__header">
        <h2 className="seo-card__title">Google preview</h2>
      </Card.Header>
      <Card.Body className="seo-card__body">
        <div className="serp">
          <div className="serp__site">
            <span className="serp__favicon" aria-hidden="true">
              {host.charAt(0).toUpperCase()}
            </span>
            <div className="serp__site-text">
              <span className="serp__host">{host}</span>
              <span className="serp__path">
                {`https://${host}`}
                {breadcrumb && ` › ${breadcrumb}`}
              </span>
            </div>
          </div>

          <div className={`serp__title ${title ? '' : 'serp__missing'}`}>
            {title ? truncate(title, 60) : 'No title tag – Google will choose its own'}
          </div>
          <p className={`serp__desc ${description ? '' : 'serp__missing'}`}>
            {description
              ? truncate(description, 160)
              : 'No meta description – Google will pick some text from the page'}
          </p>
        </div>
        <p className="serp__note">Approximate preview. Google sometimes rewrites titles and descriptions.</p>
      </Card.Body>
    </Card>
  )
}

export default SerpPreview

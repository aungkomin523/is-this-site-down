import { Accordion, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FAQS, faqSchema } from '../content/faq'
import HttpCodeGuide from './HttpCodeGuide'

// "<" escaped so the JSON can never close the <script> tag early
const schemaJson = JSON.stringify(faqSchema).replace(/</g, '\\u003c')

function FaqSection() {
  return (
    <section className="faq-section" aria-labelledby="faq-heading">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h2 id="faq-heading" className="faq-heading">
            Frequently asked questions
          </h2>
          <p className="faq-intro">Quick answers about website outages, error codes and SEO.</p>

          <Accordion flush className="faq-accordion">
            {FAQS.map((faq) => (
              <Accordion.Item eventKey={faq.id} key={faq.id} id={`faq-${faq.id}`}>
                <Accordion.Header as="h3">{faq.question}</Accordion.Header>
                <Accordion.Body>
                  {faq.answer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {faq.steps && (
                    <ol className="faq-steps">
                      {faq.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  )}

                  {faq.httpCodes && <HttpCodeGuide />}

                  {faq.link && (
                    <p>
                      <Link to={faq.link.to} className="seo-link">
                        {faq.link.label}
                      </Link>
                    </p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>

      {/* FAQPage structured data: lets Google show these answers in search results */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
    </section>
  )
}

export default FaqSection

// FAQ content for the home page.
// The same text feeds the visible accordion AND the FAQPage structured data,
// so what Google reads always matches what visitors see.

export const HTTP_CODES = [
  { code: '200', name: 'OK', who: 'none', desc: 'The site answered normally. This is what a working page returns.' },
  { code: '301 / 302', name: 'Redirect', who: 'none', desc: 'The page has moved. Browsers (and Up or Not) follow the redirect automatically.' },
  { code: '403', name: 'Forbidden', who: 'site', desc: 'The server refuses access. Often it is blocking bots, a country, or VPN traffic.' },
  { code: '404', name: 'Not Found', who: 'link', desc: "The page doesn't exist. Check the URL for typos, or the link may be out of date." },
  { code: '429', name: 'Too Many Requests', who: 'you', desc: 'You have sent too many requests in a short time. Wait a minute and try again.' },
  { code: '500', name: 'Internal Server Error', who: 'site', desc: "Something crashed in the website's own code. Only the site owner can fix it." },
  { code: '502', name: 'Bad Gateway', who: 'site', desc: 'A proxy or CDN in front of the site got a bad answer from the server behind it.' },
  { code: '503', name: 'Service Unavailable', who: 'site', desc: 'The server is overloaded or down for maintenance. Usually temporary.' },
  { code: '504', name: 'Gateway Timeout', who: 'site', desc: 'The server behind the proxy took too long to respond.' },
]

export const WHO_LABELS = { none: 'All good', site: 'Website', link: 'Link', you: 'You' }

export const FAQS = [
  {
    id: 'everyone-or-me',
    question: 'Is the website down for everyone or just me?',
    answer: [
      'Enter the address above and Up or Not checks the site from our own server, not from your device. If it shows Up, the site is working and the problem is most likely on your side.',
      'If it shows Down, the site itself is having trouble and other people will see the same problem.',
    ],
  },
  {
    id: 'not-loading',
    question: 'Why is a website not loading for me when it is up?',
    answer: [
      'The most common causes are your internet connection, your DNS settings, an old copy of the page in your browser cache, a VPN or firewall, or the site blocking your country or network.',
    ],
  },
  {
    id: 'fix-for-me',
    question: 'How do I fix a website that is only down for me?',
    answer: ['Try these steps in order, checking the site after each one:'],
    steps: [
      'Refresh the page, or open it in a private/incognito window.',
      'Try a different browser or device.',
      'Clear your browser cache and cookies for that site.',
      'Turn off your VPN or ad blocker.',
      'Switch from Wi-Fi to mobile data to rule out your network.',
      'Restart your router, or change your DNS to a public one such as 1.1.1.1 or 8.8.8.8.',
    ],
  },
  {
    id: 'http-codes',
    question: 'What do HTTP error codes like 404, 500 and 503 mean?',
    answer: [
      'Every time a website answers, it sends a three-digit status code. Codes starting with 2 mean success, 3 means a redirect, 4 usually means a problem with the request or link, and 5 means the server itself has a problem. Here are the ones you will see most often:',
    ],
    httpCodes: true,
  },
  {
    id: 'timeout-error',
    question: 'What do TIMEOUT and ERROR mean in the results?',
    answer: [
      'TIMEOUT means the site did not respond within 10 seconds. The server may be overloaded or completely down.',
      'ERROR means we could not connect at all. Common reasons are a domain that no longer exists, a server refusing connections, or an invalid security certificate.',
    ],
  },
  {
    id: 'response-time',
    question: 'What does response time mean?',
    answer: [
      'Response time is how long the site took to answer our request, in milliseconds (ms). As a rough guide, under 300 ms is fast, 300 to 1,000 ms is acceptable, and over 1,000 ms (one second) feels slow to visitors.',
    ],
  },
  {
    id: 'seo-checker',
    question: 'What does the SEO checker look at?',
    answer: [
      "It reads the page's head section and checks the essentials search engines use: the title, meta description, canonical URL, robots rules, mobile viewport, language, Open Graph tags, structured data, HTTPS, robots.txt and sitemap.xml. You get a score out of 100 and a clear fix for every problem.",
    ],
    link: { to: '/seo', label: 'Open the SEO checker →' },
  },
  {
    id: 'free-privacy',
    question: 'Is Up or Not free? Do you store the websites I check?',
    answer: [
      'Yes, it is completely free and needs no sign-up. We do not save the addresses you check. SEO results are kept in memory for up to an hour so repeat checks are instant, and then they are discarded.',
    ],
  },
]

// Plain-text answer for structured data (includes steps and the code guide)
const answerText = (faq) => {
  const parts = [...faq.answer]
  if (faq.steps) parts.push(faq.steps.map((step, i) => `${i + 1}. ${step}`).join(' '))
  if (faq.httpCodes) parts.push(HTTP_CODES.map((c) => `${c.code} ${c.name}: ${c.desc}`).join(' '))
  return parts.join(' ')
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: answerText(faq) },
  })),
}

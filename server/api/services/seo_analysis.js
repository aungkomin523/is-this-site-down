const cheerio = require('cheerio');
const MAX_BYTES_READ = 256 * 1024;

async function fetchHead(targetUrl, { maxBytes = MAX_BYTES_READ } = {}) {
    const res = await fetch(targetUrl, {
        redirect: 'follow',
        signal: AbortSignal.timeout(10000),
        headers: { 'User-Agent': 'UpOrNotBot/1.0 (+https://upornot.dev)' }
    })

    const type = res.headers.get('content-type') || ''
    if (!type.includes('text/html')) {
        await res.body?.cancel();
        throw new Error(`Not an HTML page (${type || 'unknown type'})`)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let html = '';
    let bytes = 0;
    let headComplete = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        bytes += value.length;

        const searchFrom = Math.max(0, html.length - 7);
        html += decoder.decode(value, { stream: true })

        const end = html.slice(searchFrom).search(/<\/head\s*>/i);
        if (end != -1) {
            html = html.slice(0, searchFrom + end) + '</head>'
            headComplete = true;
            break;
        }

        if (bytes >= maxBytes) break;
    }

    await reader.cancel();

    return {
        status: res.status,
        finalUrl: res.url,
        headers: res.headers,
        html,
        bytesRead: bytes,
        headComplete,
    }
}

// SEO rules
function check(name, status, detail, fix) {
    return { name, status, detail, fix: status === 'pass' ? null : fix }
}

function lengthCheck(name, value, min, max, tag) {
    if (!value) return check(name, 'fail', 'Missing', `Add a ${tag}`)
    const len = value.length;
    if (len < min || len > max) {
        return check(name, 'warn', `${len} characters`, `Aim for ${min}-${max} characters`);
    }
    return check(name, 'pass', `${len} characters`);
}

function runHeadChecks(d) {
    return [
        lengthCheck('Title', d.title, 30, 60, '<title> tag'),
        lengthCheck('Meta description', d.description, 70, 160, '<meta name="description">'),
        check('Canonical URL', d.canonical ? 'pass' : 'warn',
            d.canonical || 'Missing', 'Add <link rel="canonical" href="...">'),
        check('Indexable', /noindex/i.test(d.robots || '') ? 'fail' : 'pass',
            d.robots || 'No robots restrictions', 'Remove "noindex" so Google can list this page'),
        check('Mobile viewport', d.viewport ? 'pass' : 'fail',
            d.viewport || 'Missing', 'Add <meta name="viewport" content="width=device-width, initial-scale=1">'),
        check('Language', d.lang ? 'pass' : 'warn',
            d.lang || 'Missing', 'Add lang="en" to the <html> tag'),
        check('Open Graph', d.ogTitle && d.ogImage ? 'pass' : 'warn',
            d.ogTitle && d.ogImage ? 'og:title and og:image set' : 'Incomplete',
            'Add og:title and og:image for nicer link previews'),
        check('Structured data', d.jsonLd > 0 ? 'pass' : 'warn',
            `${d.jsonLd} JSON-LD block(s)`, 'Add JSON-LD structured data'),
        check('HTTPS', d.finalUrl.startsWith('https://') ? 'pass' : 'fail',
            d.finalUrl, 'Serve the site over HTTPS'),
    ];
}

async function checkRobotsAndSitemap(siteUrl) {
    const origin = new URL(siteUrl).origin;
    const get = (path) => fetch(origin + path, {
        signal: AbortSignal.timeout(5000),
        headers: { 'User-Agent': 'UpOrNotBot/1.0 (+https://upornot.dev)' },
    }).catch(() => null);

    const [robots, sitemap] = await Promise.all([get('/robots.txt'), get('/sitemap.xml')]);
    const robotsText = robots?.ok ? (await robots.text()).slice(0, 50000) : '';

    return [
        check('robots.txt', robots?.ok ? 'pass' : 'warn',
            robots?.ok ? 'Found' : 'Not found', 'Add a robots.txt file'),
        check('Blocks all crawlers', /^\s*disallow:\s*\/\s*$/im.test(robotsText) ? 'fail' : 'pass',
            'Checked robots.txt', 'Remove "Disallow: /" so search engines can crawl'),
        check('sitemap.xml', sitemap?.ok ? 'pass' : 'warn',
            sitemap?.ok ? 'Found' : 'Not found', 'Add a sitemap.xml and link it in robots.txt'),
    ];
}

const WEIGHTS = { Title: 3, 'Meta description': 3, Indexable: 3, HTTPS: 2, 'Mobile viewport': 2 }; // others = 1
const POINTS = { pass: 1, warn: 0.5, fail: 0 };

async function SeoScoreCheck(url) {
    const page = await fetchHead(url);
    const $ = cheerio.load(page.html);

    const data = {
        finalUrl: page.finalUrl,
        title: $('title').first().text().trim(),
        description: $('meta[name="description"]').attr('content')?.trim(),
        canonical: $('link[rel="canonical"]').attr('href'),
        robots: $('meta[name="robots"]').attr('content') || page.headers.get('x-robots-tag'),
        viewport: $('meta[name="viewport"]').attr('content'),
        lang: $('html').attr('lang'),
        ogTitle: $('meta[property="og:title"]').attr('content'),
        ogImage: $('meta[property="og:image"]').attr('content'),
        jsonLd: $('script[type="application/ld+json"]').length,
    };

    const checks = [...runHeadChecks(data), ...(await checkRobotsAndSitemap(url))];
    if (!page.headComplete) {
        checks.push(check('Page head', 'warn', 'End of <head> not found within 256 KB',
            'Check the page HTML is valid'));
    }

    let total = 0, earned = 0;
    for (const c of checks) {
        const w = WEIGHTS[c.name] || 1;
        total += w;
        earned += w * POINTS[c.status];
    }

    return {
        url,
        finalUrl: page.finalUrl,
        score: Math.round((earned / total) * 100),
        page: { title: data.title || '', description: data.description || '' }, // for the Google preview
        checks,
    };
}

module.exports = {
    SeoScoreCheck
}
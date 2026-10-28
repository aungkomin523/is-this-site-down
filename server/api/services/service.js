const { checkWebsite } = require('./checker');
const { SeoScoreCheck } = require('./seo_analysis');

// Future regions (New York, Singapore) go here as remote workers
const REMOTE_WORKERS = [
  { region: 'new-york', url: process.env.NEW_YORK_WORKER_URL, secret_key: process.env.NEW_YORK_WORKER_SECRET_KEY },
  { region: 'singapore', url: process.env.SINGAPORE_WORKER_URL, secret_key: process.env.SINGAPORE_WORKER_SECRET_KEY },
];

class Service {
  static async checkFromAllRegions(targetUrl) {
    return Promise.all([
      Service.checkLocally(targetUrl),
      // skip regions whose URL isn't set in .env (so they don't show as "Down")
      ...REMOTE_WORKERS
        .filter(worker => worker.url)
        .map(worker => Service.checkRemote(worker, targetUrl)),
    ]);
  }

  static async checkLocally(targetUrl) {
    const result = await checkWebsite(targetUrl);
    return { region: 'london', url: targetUrl, ...result };
  }

  static async checkRemote(worker, targetUrl) {
    try {
      const response = await fetch(worker.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Worker-Key': worker.secret_key,
        },
        body: JSON.stringify({ url: targetUrl }),
        signal: AbortSignal.timeout(15000),
      });
      return await response.json();
    } catch {
      return { region: worker.region, url: targetUrl, status: 'ERROR', error: 'Worker unreachable' };
    }
  }

  static async checkSeo(targetUrl) {
    const result = await SeoScoreCheck(targetUrl);
    return result;
  }
}

module.exports = Service;

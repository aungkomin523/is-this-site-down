const Service = require('../services/service');
const { validateUrl } = require('../services/url-validator');

const seoCache = new Map();
const SEO_CACHE_MS = 60 * 60 * 1000;

class Controller {

  static async controller(req, res) {
    const { url } = req.body || {};

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Blocks private IPs, AWS metadata (169.254.x.x), credentials and non-http(s) URLs
    try {
      await validateUrl(url);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    try {
      const results = await Service.checkFromAllRegions(url);
      return res.status(200).json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Check failed' });
    }
  }

  static async SeoCheckController(req, res) {
    const {url} = req.body || {};

    if(!url){
      return res.status(400).json({ error: 'URL is required' });
    }

    try {
      await validateUrl(url);
    } catch (error) {
      return res.status(400).json({error: error.message});
    }

    const cached = seoCache.get(url);

    if(cached && cached.expires > Date.now()){
      return res.json({...cached.data, cached:true});
    }

    try {
      const data = await Service.checkSeo(url);
      if (seoCache.size > 1000) seoCache.clear();
      seoCache.set(url, {data, expires: Date.now() + SEO_CACHE_MS});
      return res.json({...data, cached: false});
    } catch (error) {
      return res.status(502).json({error: `Couldn't check this page: ${error.message}`});
    }
  }
}

module.exports = Controller;

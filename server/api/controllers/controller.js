const Service = require('../services/service');
const { validateUrl } = require('../services/url-validator');

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
}

module.exports = Controller;

const express = require('express');
const Controller = require('../controllers/controller');

const router = express.Router();

router.post('/check', Controller.controller);
router.post('/seo', Controller.SeoCheckController);
router.get('/health', (_req, res) => res.json({status: 'ok'}));

module.exports = router;
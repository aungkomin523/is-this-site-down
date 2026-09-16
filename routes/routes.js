const express = require('express');
const Controller = require('../controllers/controller');

const router = express.Router();

router.post('/check', Controller.controller);

module.exports = router;
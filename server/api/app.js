const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

// Routes imports
const routes = require('./routes/routes');

app.set('trust proxy', 1); // behind nginx, so rate limiting sees real visitor IPs
app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// 30 checks per minute per IP
app.use('/api/check', rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use('/api/seo', rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Routes
app.use('/api', routes);

// React build
const clientBuild = path.join(__dirname, 'dist');
app.use(express.static(clientBuild));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Up or Not API listening on port ${port}`);
});

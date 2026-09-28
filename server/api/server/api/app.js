const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const port = 3000;

const app = express();

// Routes imports
const routes = require('./routes/routes');

app.use(cors());

// Middleware
app.use(parser.json());

// Routes
app.use('/api', routes);

// React Build
const clientBuild = path.join(__dirname, '..', 'api', 'dist');
app.use(express.static(clientBuild));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
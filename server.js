const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const deepLRoutes = require('./routes/deepL.routes.js');

function createServer() {
  const app = express();

  const corsOptions = {
    origin: '*',
    // process.env.NODE_ENV === 'production'
    //   ? 'https://myapp.netlify.app'
    //   : '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };

  app.use(cors(corsOptions));
  app.use(helmet()); // security with express-helmet

  app.use(bodyParser.json({ limit: '2mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '2mb' }));

  app.use(logger('dev'));

  // this route doesn't need an api key because app.use(apikey) is called later
  app.get('/', (_req, res) => {
    res.send('<h1>Hello</h1>');
  });

  app.use('/api', deepLRoutes);
  return app;
}

module.exports = createServer;

require('dotenv').config();

var express = require('express');
var compression = require('compression');
var path = require('path');
var bluebird = require('bluebird');
var fs = require('fs');
var cors = require('cors');
var helmet = require('helmet');

// 1. Import the express-openapi-validator library
const OpenApiValidator = require('express-openapi-validator');

const ROUTES_DIR = 'routes/';

async function main() {
  app = express();
  
  // Apply helmet middleware early to enhance security by setting various HTTP headers
  app.use(helmet());

  // compress all responses
  app.use(compression());
  
  // parse application/json
  app.use(express.json());
  app.use(express.text());

  // Configure and apply CORS middleware with appropriate options
  // For example, allow all origins, but in production specify allowed origins explicitly
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  }));

  app.use(express.urlencoded({ extended: false }));

  const directories = await bluebird.promisify(fs.readdir)(path.join(__dirname, ROUTES_DIR));

  for (const c of directories) {
    try {
      const apiSpec = path.join(__dirname, `/documentation/${c}.yaml`);
      app.use(`/spec/${c}`, express.static(apiSpec));
      app.use(
        OpenApiValidator.middleware({
          apiSpec: apiSpec,
          validateResponses: false, // <-- to validate responses
        })
      );
      require(path.join(__dirname, ROUTES_DIR, c)).init(app);
    } catch (error) {
      console.error(error);
    }
  }
}

main();
module.exports = app;

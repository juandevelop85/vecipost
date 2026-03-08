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

// Import postgresDB singleton
const postgresDB = require('./db/postgresDB').default;

// Import auth routes
const authRoutes = require('./routes/auth/index');

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

  // Add /health route to check server and DB connectivity
  app.get('/health', async (req, res) => {
    try {
      // Perform a simple query to verify DB connection
      await postgresDB.instance.db.sequelize.query('SELECT 1');
      res.json({ status: 'UP', database: 'CONNECTED' });
    } catch (error) {
      res.status(503).json({ status: 'DOWN', database: 'DISCONNECTED', error: error.message });
    }
  });

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

  // Use auth routes
  authRoutes.init(app);
}

main();
module.exports = app;

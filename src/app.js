require('dotenv').config();

var express = require('express');
var compression = require('compression');
// const fileUpload = require('express-fileupload');
var path = require('path');
var bluebird = require('bluebird');
var fs = require('fs');
var cors = require('cors');

// 1. Import the express-openapi-validator library
const { OpenApiValidator } = require('express-openapi-validator');

const ROUTES_DIR = 'routes/';

async function main() {
  app = express();
  // compress all responses
  app.use(compression());
  // parse application/json
  app.use(express.json());
  app.use(express.text());

  app.use(cors());
  app.use(express.urlencoded({ extended: false }));

  const directories = await bluebird.promisify(fs.readdir)(path.join(__dirname, ROUTES_DIR));

  for (const c of directories) {
    try {
      const apiSpec = path.join(__dirname, `/documentation/${c}.yaml`);
      app.use(`/spec/${c}`, express.static(apiSpec));
      await new OpenApiValidator({
        apiSpec,
      }).install(app);
      require(path.join(__dirname, ROUTES_DIR, c)).init(app);
    } catch (error) {
      console.error(error);
    }
  }
}

main();
module.exports = app;

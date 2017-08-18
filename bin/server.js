process.env.APP_ENV = 'API';
require('dotenv').config();
require('source-map-support').install();
require('../dist/server');

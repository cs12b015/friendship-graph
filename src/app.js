const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const path = require('path');
const { morgan } = require('./utils');
const { errorHandler } = require('./middlewares');

const router = require('./routes');

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// set security HTTP headers
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.static(path.join(__dirname, '../static')));

// api routes
app.use('/api', router);

app.use(errorHandler.methodNotAllowed);
app.use(errorHandler.genericErrorHandler);

module.exports = app;

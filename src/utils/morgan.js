const morgan = require('morgan');
const config = require('../config');
const logger = require('./logger');

morgan.token('message', (req, res) => res.locals.errorMessage || '');

const getIpFormat = () => (config.env === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

/**
 * @description Morgan middleware to log all requests.
 * @param {Object} successResponseFormat Format of the success response
 * @param {Object} req Request object with its details
 * @param {Object} res Response object with its details
 * @param {Function} next A middleware of further potential flow
 * @returns {Void} No return value, just send a response
 */
const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

/**
 * @description Error handler middleware for morgan
 * @param {Object} err Potential error object in case of it happens
 * @param {Object} req Request object with its details
 * @param {Object} res Response object with its details
 * @param {Function} next A middleware of further potential flow
 * @returns {Void} No return value, just send a response
 */
const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

module.exports = {
  successHandler,
  errorHandler,
};

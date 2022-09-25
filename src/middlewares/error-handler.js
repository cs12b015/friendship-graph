const HttpStatus = require('http-status');

/**
 *  @description Method not allowed error middleware.
 *  This middleware should be placed at the very bottom of the middleware stack.
 *
 * @param {Object} req Request object with its details
 * @param {Object} res Response object with its details
 * @returns {Void} No return value, just send a response
 */
const methodNotAllowed = (req, res) => {
  res.locals.errorMessage = HttpStatus[HttpStatus.METHOD_NOT_ALLOWED];
  res.status(HttpStatus.METHOD_NOT_ALLOWED).json({
    success: false,
    error: HttpStatus[HttpStatus.METHOD_NOT_ALLOWED],
  });
};

/**
 * @description Generic error response middleware for validation and internal server errors.
 * @param  {Object} err Potential error object in case of it happens
 * @param  {Object} req Request object with its details
 * @param  {Object} res Response object with its details
 * @param  {Function} next A middleware of further potential flow
 * @returns {Void} No return value, just send a response
 */
// eslint-disable-next-line no-unused-vars
const genericErrorHandler = (err, req, res, next) => {
  let error;
  let code;
  if (err.isJoi) {
    code = HttpStatus.BAD_REQUEST;
    error = {
      success: false,
      error: HttpStatus[HttpStatus.BAD_REQUEST],
      details: err.details
        ? err.details.map((e) => ({
            message: e.message,
            param: e.path.join('.'),
          }))
        : err.errors.map((e) => e.messages.join('. ')).join(' and '),
    };
  } else if (err.status < HttpStatus.INTERNAL_SERVER_ERROR) {
    code = err.status;
    error = {
      success: false,
      error: err.message,
    };
    if (err.details) {
      error.details = err.details;
    }
  } else {
    // Return INTERNAL_SERVER_ERROR for all other cases
    code = HttpStatus.INTERNAL_SERVER_ERROR;
    error = {
      success: false,
      error: HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR],
    };
  }
  res.locals.errorMessage = error.error;
  res.status(code).json(error);
};

module.exports = {
  methodNotAllowed,
  genericErrorHandler,
};

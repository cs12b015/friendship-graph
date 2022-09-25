const Joi = require('joi');
const { pick } = require('lodash');

/**
 * Joi validation middleware
 * @param {Object} schema
 * @returns {Function}
 */
const requestValidator = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    return next(error);
  }
  Object.assign(req, value);
  return next();
};

module.exports = requestValidator;

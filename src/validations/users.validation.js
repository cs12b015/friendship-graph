const Joi = require('joi');

const search = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
    query: Joi.string().required(),
  }),
};

const friend = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
    friendId: Joi.number().integer().required(),
  }),
};

const unfriend = {
  params: Joi.object().keys({
    userId: Joi.number().integer().required(),
    friendId: Joi.number().integer().required(),
  }),
};

module.exports = {
  search,
  friend,
  unfriend,
};

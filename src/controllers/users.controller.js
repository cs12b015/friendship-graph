const HttpStatus = require('http-status');
const { usersService } = require('../services');

/**
 * @description Get all friends of a user
 * @param {Object} req Request object with its details
 * @param {Object} res Response object with its details
 * @param {Function} next A middleware of further potential flow
 * @returns {Array} List of friends
 */
const search = async (req, res, next) => {
  const { query, userId } = req.params;
  let results;
  try {
    results = await usersService.search(query, userId);
  } catch (err) {
    return next(err);
  }

  res.status(HttpStatus.OK).json({ success: true, users: results });
};

/**
 * @description Add a friend to a user
 * @param {Object} req Request object with its details
 * @param {Object} res Response object with its details
 * @param {Function} next A middleware of further potential flow
 * @returns {Object} The friend added
 */
const friend = async (req, res, next) => {
  const { userId, friendId } = req.params;

  try {
    await usersService.friend(userId, friendId);
  } catch (err) {
    return next(err);
  }

  res.status(HttpStatus.OK).json({ success: true });
};

/**
 * @description Remove a friend from a user
 * @param {Object} req Request object with its details
 * @param {Object} res Response object with its details
 * @param {Function} next A middleware of further potential flow
 * @returns {Object} The friend removed
 */
const unfriend = async (req, res, next) => {
  const { userId, friendId } = req.params;

  try {
    await usersService.unfriend(userId, friendId);
  } catch (err) {
    return next(err);
  }

  res.status(HttpStatus.OK).json({ success: true });
};

module.exports = {
  search,
  friend,
  unfriend,
};

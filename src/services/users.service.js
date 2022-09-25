const { QueryTypes } = require('sequelize');
const { Friend, sequelize } = require('../models');

const DEPTH = 2; // degrees of separation in graph

/**
 * @description Search for friends of a user
 * @param {String} query Search query
 * @param {Number} userId User id
 * @param {Number} depth Depth of the search
 * @returns {Promise} Promise object represents the result of the search
 */
const search = (query, userId, depth = DEPTH) =>
  sequelize.query(
    `WITH RECURSIVE find_depth(userId, friendId, distance, path) AS
      (SELECT userId, friendId, 1 AS distance, userId || '.' || friendId || '.' AS path
        FROM Friends WHERE userId = ${userId}
        UNION ALL
        SELECT fd.userId, f.friendId, fd.distance + 1, fd.path || f.friendId || '.' AS path
        FROM Friends AS f
        JOIN find_depth AS fd ON f.userId = fd.friendId and fd.distance < ${depth}
        WHERE fd.path NOT LIKE '%' || f.friendId || '.%' 
      )
      SELECT id, name, IFNULL((SELECT min(distance) FROM find_depth WHERE friendId = id), 0) as connection
      FROM Users WHERE name LIKE '${query}%' LIMIT 20;`,
    {
      type: QueryTypes.SELECT,
    }
  );

/**
 * @description Add a friend to a user
 * @param {Number} userId User id
 * @param {Number} friendId Friend id
 * @returns {Promise} Promise object represents the result of the operation
 * @throws {Error} Throws an error if the friend is already added
 */
const friend = (userId, friendId) => Friend.create({ userId, friendId });

/**
 * @description Remove a friend from a user
 * @param {Number} userId User id
 * @param {Number} friendId Friend id
 * @returns {Promise} Promise object represents the result of the operation
 * @throws {Error} Throws an error if the friend is not added
 */
const unfriend = (userId, friendId) => Friend.destroy({ where: { userId, friendId } });

module.exports = {
  search,
  friend,
  unfriend,
};

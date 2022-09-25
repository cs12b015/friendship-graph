const faker = require('faker');
const { User, Friend } = require('../../src/models');

const insertUser = () => User.create({ name: faker.name.findName() });

const friendUsers = (userId, friendId) => Friend.create({ userId, friendId });

const unfriendUsers = (userId, friendId) => Friend.destroy({ where: { userId, friendId } });

module.exports = {
  insertUser,
  friendUsers,
  unfriendUsers,
};

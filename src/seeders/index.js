const plimit = require('p-limit')(100000);
const { chunk } = require('lodash');
const { logger } = require('../utils');

const MAX_PROMISE_ALL_SIZE = 2000000;

const init = async (db) => {
  const users = [];
  const names = ['foo', 'bar', 'baz'];

  for (let i = 0; i < 27000; i += 1) {
    let n = i;
    let name = '';
    for (let j = 0; j < 3; j += 1) {
      name += names[n % 3];
      n = Math.floor(n / 3);
      name += n % 10;
      n = Math.floor(n / 10);
    }
    users.push(name);
  }
  const friends = users.map(() => []);
  for (let i = 0; i < friends.length; i += 1) {
    const n = 10 + Math.floor(90 * Math.random());
    const list = [...Array(n)].map(() => Math.floor(friends.length * Math.random()));
    list.forEach((j) => {
      if (i === j) {
        return;
      }
      if (friends[i].indexOf(j) >= 0 || friends[j].indexOf(i) >= 0) {
        return;
      }
      friends[i].push(j);
      friends[j].push(i);
    });
  }
  logger.info('Init Users Table...');
  await Promise.all(users.map((un) => db.run(`INSERT INTO Users (name) VALUES ('${un}');`)));
  logger.info(`[${new Date()}]: Init Friends Table...`);

  const insertPromises = [];
  for (let i = 0; i < friends.length; i += 1) {
    const list = friends[i];
    for (let j = 0; j < list.length; j += 1) {
      insertPromises.push(plimit(() => db.run(`INSERT INTO Friends (userId, friendId) VALUES (${i + 1}, ${list[j] + 1});`)));
    }
  }
  logger.info(`Inserting ${insertPromises.length} records to Friends table...`);
  const chunkedInsertPromises = chunk(insertPromises, MAX_PROMISE_ALL_SIZE);
  await Promise.all(chunkedInsertPromises.map((chunkedInsertPromise) => Promise.all(chunkedInsertPromise)));
  logger.info(`[${new Date()}]: Ready.`);
};
module.exports.init = init;

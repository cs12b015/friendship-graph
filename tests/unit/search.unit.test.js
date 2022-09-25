const { usersService } = require('../../src/services');
const { insertUser, friendUsers } = require('../fixtures/user.fixture');
const models = require('../../src/models');

let user1;
let user2;
let user3;

beforeAll(async () => {
  await models.init(false);
  user1 = await insertUser();
  user2 = await insertUser();
  user3 = await insertUser();
});

describe('Search Test', () => {
  it('Should search for user who is not a friend', async () => {
    const resp = await usersService.search(user2.name, user1.id);
    const { connection } = resp.find(({ id }) => id === user2.id);
    expect(connection).toEqual(0);
  });

  it('Should search for user who is a friend', async () => {
    await friendUsers(user1.id, user2.id);
    const resp = await usersService.search(user2.name, user1.id);
    const { connection } = resp.find(({ id }) => id === user2.id);
    expect(connection).toEqual(1);
  });

  it('Should search for user who is a friend of a friend', async () => {
    await friendUsers(user2.id, user3.id);
    const resp = await usersService.search(user3.name, user1.id);
    const { connection } = resp.find(({ id }) => id === user3.id);
    expect(connection).toEqual(2);
  });
});

afterAll(async () => {
  await models.sequelize.close();
});

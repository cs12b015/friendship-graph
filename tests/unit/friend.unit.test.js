const { usersService } = require('../../src/services');
const { insertUser } = require('../fixtures/user.fixture');
const models = require('../../src/models');

let user;
let mockFriend;

beforeAll(async () => {
  await models.init(false);
  user = await insertUser();
  mockFriend = await insertUser();
});

describe('Friend Modal', () => {
  it('Should add a new friend', async () => {
    const fakeData = {
      userId: user.id,
      friendId: mockFriend.id,
    };

    const resp = await usersService.friend(fakeData.userId, fakeData.friendId);

    expect(resp.dataValues.userId).toEqual(fakeData.userId);
    expect(resp.dataValues.friendId).toEqual(fakeData.friendId);
  });

  it('Should delete a friend', async () => {
    const fakeData = {
      userId: user.id,
      friendId: mockFriend.id,
    };
    const resp = await usersService.unfriend(fakeData.userId, fakeData.friendId);
    expect(resp).toEqual(1);
  });

  it('Deleting not a friend', async () => {
    const fakeData = {
      userId: user.id,
      friendId: mockFriend.id,
    };
    const resp = await usersService.unfriend(fakeData.userId, fakeData.friendId);
    expect(resp).toEqual(0);
  });
});

afterAll(async () => {
  await models.sequelize.close();
});

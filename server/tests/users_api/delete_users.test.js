const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../app');
const api = supertest(app);
const User = require('../../models/user');
const {
  getAllUsers,
  getByUsername,
  prettifyUser
} = require('../../utils/api_helper');

beforeEach(async () => {
  await User.deleteMany({});

  const saltRounds = 10;
  const rootPasswordHash = await bcrypt.hash('supremepassword', saltRounds);
  const rootUser = new User({
    username: 'root',
    name: 'admin',
    passwordHash: rootPasswordHash
  });
  await rootUser.save();

  const passwordHash1 = await bcrypt.hash('kennwort', saltRounds);
  const user1 = new User({
    username: 'reservecrate',
    name: 'Aldi',
    passwordHash: passwordHash1
  });
  await user1.save();

  const passwordHash2 = await bcrypt.hash('niemals', saltRounds);
  const user2 = new User({
    username: 'breezehash',
    name: 'Joel',
    passwordHash: passwordHash2
  });
  await user2.save();

  const passwordHash3 = await bcrypt.hash('lecso', saltRounds);
  const user3 = new User({
    username: 'wirelessspice',
    name: 'Gabor',
    passwordHash: passwordHash3
  });
  await user3.save();
}, 50000);

describe('deleting users', () => {
  test('returns SC 200 + deleted user when the token is valid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToDelete = await getByUsername(login.username);
    const { id } = userToDelete;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const { body: deletedUser } = await api
      .delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedDeletedUser = prettifyUser(deletedUser);

    const usersAfter = await getAllUsers();
    expect(prettifiedDeletedUser).toEqual(userToDelete);
    expect(usersAfter).toHaveLength(usersBefore.length - 1);
    expect(usersAfter).not.toContainEqual(prettifiedDeletedUser);
  });
  test('fails with SC 401 when the token is invalid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const wrongLogin = { username: 'breezehash', password: 'niemals' };
    const userToDelete = await getByUsername(login.username);
    const { id } = userToDelete;
    const { token: wrongToken } = (
      await api.post('/api/login').send({ ...wrongLogin })
    ).body;

    await api
      .delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toHaveLength(usersBefore.length);
    expect(usersAfter).toContainEqual(userToDelete);
  });
  test('fails with SC 401 when the token is missing', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToDelete = await getByUsername(login.username);
    const { id } = userToDelete;

    await api
      .delete(`/api/users/${id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
    expect(usersAfter).toContainEqual(userToDelete);
  });
  //test when the user id is invalid but the token is valid! if the id is invalid, then it should say so without even checking if the request has a token
});

afterAll(async () => {
  await mongoose.connection.close();
});
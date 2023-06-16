const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../app');
const api = supertest(app);
const User = require('../../models/user');
const {
  getAllUsers,
  getByUsername,
  prettifyUsers,
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

describe('fetching all users', () => {
  test('returns SC 200 + all users in the correct order', async () => {
    const allUsers = await getAllUsers();

    const { body: users } = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedUsers = prettifyUsers(users);

    expect(prettifiedUsers).toEqual(allUsers);
    expect(users[1].username).toBe('reservecrate');
    expect(users[2].name).toBe('Joel');
  });
});
describe('fetching a single user', () => {
  test('returns SC 200 + the right user when given a valid id', async () => {
    const userToFetch1 = await getByUsername('reservecrate');
    const { body: fetchedUser1 } = await api
      .get(`/api/users/${userToFetch1.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedFetchedUser1 = prettifyUser(fetchedUser1);
    expect(prettifiedFetchedUser1).toEqual(userToFetch1);

    const userToFetch2 = await getByUsername('wirelessspice');
    const { body: fetchedUser2 } = await api
      .get(`/api/users/${userToFetch2.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedFetchedUser2 = prettifyUser(fetchedUser2);
    expect(prettifiedFetchedUser2).toEqual(userToFetch2);
  });
  test('fails with SC 404 when given nonexistent id', async () => {
    await api
      .get('/api/users/nonexistent')
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

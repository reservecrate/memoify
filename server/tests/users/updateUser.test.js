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
  // .saveMany([])

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

describe('updating the name', () => {
  test('returns SC 200 + updated user when the update payload is valid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, name: 'Aldiyar' };
    const { body: updatedUser } = await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedUpdatedUser = prettifyUser(updatedUser);

    expect(updatedUser.name).toBe(updatedUserData.name);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toHaveLength(usersBefore.length);
    expect(usersAfter).toContainEqual(prettifiedUpdatedUser);
  });
  test('fails with SC 400 if the new name is an emptry string/whitespace', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, name: '  ' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
  test('fails with SC 404 when the user id is invalid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, name: 'Aldiyar' };
    await api
      .put('/api/users/doesnotexist')
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(404)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
});
describe('updating the username', () => {
  test('returns SC 200 + updated user when the update payload is valid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, username: 'reservecase' };
    const { body: updatedUser } = await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedUpdatedUser = prettifyUser(updatedUser);

    expect(updatedUser.username).toBe(updatedUserData.username);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toHaveLength(usersBefore.length);
    expect(usersAfter).toContainEqual(prettifiedUpdatedUser);
  });
  test('fails with SC 400 if the new username is shorter than 3 characters', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, username: 're' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
});
describe('updating the password', () => {
  test('returns SC 200 + updated user when the update payload is valid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, password: 'geenword' };
    const { body: updatedUser } = await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedUpdatedUser = prettifyUser(updatedUser);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toHaveLength(usersBefore.length);
    expect(usersAfter).toContainEqual(prettifiedUpdatedUser);
  });
  test('fails with SC 400 if the new password is shorter than 5 characters (token is valid)', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, password: 'geen' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'password' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
});

describe('updating multiple values (name, username, password) simultaneously ', () => {
  test("fails with SC 400 when the user attempts to update multiple values simultaneously (using the 'name' flag)", async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = {
      ...userToUpdate,
      name: 'Aldiyar',
      username: 'reservecase',
      password: 'geenword'
    };

    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
  test("fails with SC 400 when the user attempts to update multiple values simultaneously (using the 'username' flag)", async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = {
      ...userToUpdate,
      name: 'Aldiyar',
      username: 'reservecase',
      password: 'geenword'
    };

    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
  test("fails with SC 400 when the user attempts to update multiple values simultaneously (using the 'password' flag)", async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = {
      ...userToUpdate,
      name: 'Aldiyar',
      username: 'reservecase',
      password: 'geenword'
    };

    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'password' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
});
test('fails with SC 400 when the update flag (toUpdate) is invalid/missing', async () => {
  const usersBefore = await getAllUsers();
  const login = { username: 'reservecrate', password: 'kennwort' };
  const userToUpdate = await getByUsername(login.username);
  const { id } = userToUpdate;
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const updatedUserData = { ...userToUpdate, username: 'reservecase' };
  await api
    .put(`/api/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ updatedUserData })
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const usersAfter = await getAllUsers();
  expect(usersAfter).toEqual(usersBefore);
});

describe.only('invalid/missing token (arbitrary changes to the user)', () => {
  test('fails with SC 401 when the token is invalid', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const wrongLogin = { username: 'breezehash', password: 'niemals' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;
    const { token: wrongToken } = (
      await api.post('/api/login').send({ ...wrongLogin })
    ).body;

    const updatedUserData = { ...userToUpdate, name: 'Aldiyar' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
  test('fails with SC 401 when the token is missing', async () => {
    const usersBefore = await getAllUsers();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const userToUpdate = await getByUsername(login.username);
    const { id } = userToUpdate;

    const updatedUserData = { ...userToUpdate, username: 'reservecase' };
    await api
      .put(`/api/users/${id}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter = await getAllUsers();
    expect(usersAfter).toEqual(usersBefore);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

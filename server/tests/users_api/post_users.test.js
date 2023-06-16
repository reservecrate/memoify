const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../../app');
const api = supertest(app);
const User = require('../../models/user');
const { getAllUsers, prettifyUser } = require('../../utils/api_helper');

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

describe('creating users', () => {
  describe('creating a user with valid data', () => {
    test('returns SC 201 + created user when given a valid username + password', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        username: 'theelx',
        name: 'Jonah',
        password: 'pythonista'
      };

      const { body: createdUser } = await api
        .post('/api/users')
        .send(userToCreate)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const prettifiedCreatedUser = prettifyUser(createdUser);

      expect(createdUser.username).toBe(userToCreate.username);
      expect(createdUser.name).toBe(userToCreate.name);

      const usersAfter = await getAllUsers();
      expect(usersAfter).toHaveLength(usersBefore.length + 1);
      expect(usersAfter).toContainEqual(prettifiedCreatedUser);
    });

    test('if name not given, assigns a default one (Incognito); returns SC 201 + created user', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        username: 'theelx',
        password: 'pythonista'
      };

      const { body: createdUser } = await api
        .post('/api/users')
        .send(userToCreate)
        .expect(201)
        .expect('Content-Type', /application\/json/);
      const prettifiedCreatedUser = prettifyUser(createdUser);

      expect(createdUser.username).toBe(userToCreate.username);
      expect(createdUser.name).toBe('Incognito');

      const usersAfter = await getAllUsers();
      expect(usersAfter).toHaveLength(usersBefore.length + 1);
      expect(usersAfter).toContainEqual(prettifiedCreatedUser);
    });
  });

  describe('creating a user with invalid data', () => {
    test('fails with SC 400 if the username is shorter than 3 characters', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        username: 'tx',
        name: 'Jonah',
        password: 'pythonista'
      };

      await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await getAllUsers();
      const usernames = usersAfter.map(user => user.username);
      expect(usersAfter).toHaveLength(usersBefore.length);
      expect(usernames).not.toContain(userToCreate.username);
    });
    test('fails with SC 400 if the password is shorter than 5 characters', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        username: 'theelx',
        name: 'Jonah',
        password: 'pyth'
      };

      await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await getAllUsers();
      const usernames = usersAfter.map(user => user.username);
      expect(usersAfter).toHaveLength(usersBefore.length);
      expect(usernames).not.toContain(userToCreate.username);
    });
    test('fails with SC 400 if the username is already taken', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        username: 'breezehash',
        name: 'Joel',
        password: 'jemals'
      };

      await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await getAllUsers();
      expect(usersAfter).toHaveLength(usersBefore.length);
    });
  });

  describe('creating a user with missing data', () => {
    test('fails with SC 400 if the username is missing', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        name: 'Jonah',
        password: 'pythonista'
      };

      await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await getAllUsers();
      expect(usersAfter).toHaveLength(usersBefore.length);
    });
    test('fails with SC 400 if the password is missing', async () => {
      const usersBefore = await getAllUsers();

      const userToCreate = {
        username: 'theelx',
        name: 'Jonah'
      };

      await api
        .post('/api/users')
        .send(userToCreate)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersAfter = await getAllUsers();
      expect(usersAfter).toHaveLength(usersBefore.length);
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

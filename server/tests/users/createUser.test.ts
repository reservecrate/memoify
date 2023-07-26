import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app.ts';
import User from '../../models/user.ts';
import { UserDoc } from '../../interfaces/user.ts';

const api = supertest(app);

const testHelper = async () => {
  await User.deleteMany({});

  const saltRounds = 10;
  const rootPasswordHash = await bcrypt.hash('supremepassword', saltRounds);
  const rootUser = new User({
    username: 'root',
    name: 'admin',
    passwordHash: rootPasswordHash
  }) as unknown as UserDoc;
  await rootUser.save();

  const passwordHash1 = await bcrypt.hash('kennwort', saltRounds);
  const user1 = new User({
    username: 'reservecrate',
    name: 'Aldi',
    passwordHash: passwordHash1
  }) as unknown as UserDoc;
  await user1.save();

  const passwordHash2 = await bcrypt.hash('niemals', saltRounds);
  const user2 = new User({
    username: 'breezehash',
    name: 'Joel',
    passwordHash: passwordHash2
  }) as unknown as UserDoc;
  await user2.save();

  const passwordHash3 = await bcrypt.hash('lecso', saltRounds);
  const user3 = new User({
    username: 'wirelessspice',
    name: 'Gabor',
    passwordHash: passwordHash3
  }) as unknown as UserDoc;
  await user3.save();
};

beforeEach(testHelper, 25000);

describe('creating a user with valid data', () => {
  test('returns SC 201 + created user when given a valid username + password', async () => {
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

    expect(createdUser.username).toBe(userToCreate.username);
    expect(createdUser.name).toBe(userToCreate.name);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).toContain(createdUser.username);
  });
  test('if name not given, assigns a default one (Incognito); returns SC 201 + created user', async () => {
    const userToCreate = {
      username: 'theelx',
      password: 'pythonista'
    };

    const { body: createdUser } = await api
      .post('/api/users')
      .send(userToCreate)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(createdUser.username).toBe(userToCreate.username);
    expect(createdUser.name).toBe('Incognito');

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).toContain(createdUser.username);
  });
});

describe('creating a user with invalid data', () => {
  test('fails with SC 400 if the username is shorter than 3 characters', async () => {
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

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).not.toContain(userToCreate.username);
  });
  test('fails with SC 400 if the password is shorter than 5 characters', async () => {
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

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).not.toContain(userToCreate.username);
  });
  test('fails with SC 400 if the username is already taken', async () => {
    const usersBefore: UserDoc[] = await User.find({});

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

    const usersAfter: UserDoc[] = await User.find({});
    expect(usersAfter).toEqual(usersBefore);
  });
});

describe('creating a user with missing data', () => {
  test('fails with SC 400 if the username is missing', async () => {
    const usersBefore: UserDoc[] = await User.find({});

    const userToCreate = {
      name: 'Jonah',
      password: 'pythonista'
    };

    await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    expect(usersAfter).toHaveLength(usersBefore.length);
  });
  test('fails with SC 400 if the password is missing', async () => {
    const userToCreate = {
      username: 'theelx',
      name: 'Jonah'
    };

    await api
      .post('/api/users')
      .send(userToCreate)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).not.toContain(userToCreate.username);
  });
});

afterAll(async () => await mongoose.connection.close());

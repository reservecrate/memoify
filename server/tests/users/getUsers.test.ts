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

beforeEach(testHelper, 50000);

describe('fetching all users', () => {
  test('returns SC 200 + all users in the correct order', async () => {
    const { body: users } = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(users[1].username).toBe('reservecrate');
    expect(users[2].name).toBe('Joel');
  });
});

describe('fetching a single user', () => {
  test('returns SC 200 + the right user when given a valid id', async () => {
    const userToFetch1 = (await User.findOne({
      username: 'reservecrate'
    })) as UserDoc;
    const { body: fetchedUser1 } = await api
      .get(`/api/users/${userToFetch1.id}`)
      .expect('Content-Type', /application\/json/);

    expect(fetchedUser1.username).toBe('reservecrate');
    expect(fetchedUser1.name).toBe('Aldi');

    const userToFetch2 = (await User.findOne({
      username: 'wirelessspice'
    })) as UserDoc;
    const { body: fetchedUser2 } = await api
      .get(`/api/users/${userToFetch2.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(fetchedUser2.username).toBe('wirelessspice');
    expect(fetchedUser2.name).toBe('Gabor');
  });
  test('fails with SC 404 when given a nonexistent id', async () => {
    await api
      .get('/api/users/nonexistent')
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => await mongoose.connection.close());

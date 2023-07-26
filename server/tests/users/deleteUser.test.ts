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

test('returns SC 200 + deleted user when the user id is valid', async () => {
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const userToDelete = (await User.findOne({
    username: login.username
  })) as UserDoc;
  const { id } = userToDelete;

  const { body: deletedUser } = await api
    .delete(`/api/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(deletedUser.username).toBe(userToDelete.username);

  const usersAfter: UserDoc[] = await User.find({});
  const usernames = usersAfter.map(user => user.username);

  expect(usernames).not.toContain(deletedUser.username);
});
test('fails with SC 404 when the the user id is invalid', async () => {
  const usersBefore: UserDoc[] = await User.find({});

  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  await api
    .delete('/api/users/nonexistent')
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    .expect('Content-Type', /application\/json/);

  const usersAfter: UserDoc[] = await User.find({});

  expect(usersAfter).toEqual(usersBefore);
});

describe('invalid/missing token', () => {
  test('fails with SC 401 when the token is invalid', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };
    const wrongLogin = { username: 'breezehash', password: 'niemals' };

    const userToDelete = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToDelete;
    const { token: wrongToken } = (
      await api.post('/api/login').send({ ...wrongLogin })
    ).body;

    await api
      .delete(`/api/users/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).toContain(userToDelete.username);
  });
  test('fails with SC 401 when the token is missing', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToDelete = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToDelete;

    await api
      .delete(`/api/users/${id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).toContain(userToDelete.username);
  });
});

afterAll(async () => await mongoose.connection.close());

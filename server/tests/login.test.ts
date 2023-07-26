import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.ts';
import User from '../models/user.ts';

const api = supertest(app);

const testHelper = async () => {
  await User.deleteMany({});

  await api
    .post('/api/users')
    .send({ username: 'reservecrate', name: 'Aldi', password: 'kennwort' });
  await api
    .post('/api/users')
    .send({ username: 'breezehash', name: 'Joel', password: 'niemals' });
};

beforeEach(testHelper, 25000);

describe('valid login data', () => {
  test('returns 200 + token when given valid login data', async () => {
    const validLogin = { username: 'reservecrate', password: 'kennwort' };
    const { body: loginData } = await api
      .post('/api/login')
      .send(validLogin)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const { token, username, name, id } = loginData;

    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');

    expect(username).toBeTruthy();
    expect(typeof token).toBe('string');

    expect(name).toBeTruthy();
    expect(typeof token).toBe('string');

    expect(id).toBeTruthy();
    expect(typeof token).toBe('string');
  });
});

describe('invalid login data', () => {
  test('returns 400 when given nonexistent username', async () => {
    const invalidLogin = { username: 'dinosaurrr', password: 'niemals' };

    await api
      .post('/api/login')
      .send(invalidLogin)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
  test('returns 400 when given wrong password', async () => {
    const invalidLogin = { username: 'reservecrate', password: 'falsch' };

    await api
      .post('/api/login')
      .send(invalidLogin)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

describe('missing login data', () => {
  test('returns 400 when not given a username', async () => {
    const invalidLogin = { password: 'kennwort' };

    await api
      .post('/api/login')
      .send(invalidLogin)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
  test('returns 400 when not given a password', async () => {
    const invalidLogin = { username: 'reservecrate' };

    await api
      .post('/api/login')
      .send(invalidLogin)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

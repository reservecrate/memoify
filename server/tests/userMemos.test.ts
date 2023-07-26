import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.ts';
import User from '../models/user.ts';
import Memo from '../models/memo.ts';

const api = supertest(app);

const testHelper = async () => {
  await Memo.deleteMany({});
  await User.deleteMany({});
  await api
    .post('/api/users')
    .send({ username: 'reservecrate', name: 'Aldi', password: 'kennwort' });
  await api
    .post('/api/users')
    .send({ username: 'breezehash', name: 'Joel', password: 'niemals' });

  const { token: token1 } = (
    await api
      .post('/api/login')
      .send({ username: 'reservecrate', password: 'kennwort' })
  ).body;
  const { token: token2 } = (
    await api
      .post('/api/login')
      .send({ username: 'breezehash', password: 'niemals' })
  ).body;

  const memo1 = {
    title: 'reservecrate title 1',
    content: 'reservecrate content 1',
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token1}`)
    .send(memo1)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const memo2 = {
    title: 'breezehash title 1',
    content: 'breezehash content 1',
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token2}`)
    .send(memo2)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const memo3 = {
    title: 'reservecrate title 2',
    content: 'reservecrate content 2',
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token1}`)
    .send(memo3)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const memo4 = {
    title: 'breezehash title 2',
    content: 'breezehash content 2',
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token2}`)
    .send(memo4)
    .expect(201)
    .expect('Content-Type', /application\/json/);
};

beforeEach(testHelper, 25000);

//must give token!!! (implement functionality in the future)
test('returns SC 200 + correct memos in the correct order when given a valid username (author)', async () => {
  const username = 'reservecrate';

  const { body: memosByAuthor } = await api
    .get(`/${username}/memos`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(memosByAuthor[0].title).toBe('reservecrate title 1');
  expect(memosByAuthor[0].author.username).toBe('reservecrate')
  expect(memosByAuthor[1].content).toBe('reservecrate content 2');
  expect(memosByAuthor[1].author.name).toBe('Aldi');
});

test('fails with SC 404 when given a nonexistent username (author)', async () => {
  const username = 'blimey';

  await api
    .get(`/${username}/memos`)
    .expect(404)
    .expect('Content-Type', /application\/json/);
});

//write additional tests later

afterAll(async () => {
  await mongoose.connection.close();
});

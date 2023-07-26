import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../app.ts';
import Memo from '../../models/memo.ts';
import User from '../../models/user.ts';
import { MemoDoc, PrettifiedMemo } from '../../interfaces/memo.ts';

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

  let i = 0;
  const memo1 = {
    title: `test memo ${i + 1}`,
    content: `placeholder ${i + 1}`,
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token1}`)
    .send(memo1)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  i += 1;

  const memo2 = {
    title: `test memo ${i + 1}`,
    content: `placeholder ${i + 1}`,
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token1}`)
    .send(memo2)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  i += 1;

  const memo3 = {
    title: `test memo ${i + 1}`,
    content: `placeholder ${i + 1}`,
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token2}`)
    .send(memo3)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  i += 1;

  const memo4 = {
    title: `test memo ${i + 1}`,
    content: `placeholder ${i + 1}`,
    dateCreated: Date.now()
  };
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token2}`)
    .send(memo4)
    .expect(201)
    .expect('Content-Type', /application\/json/);
  i += 1;
};

beforeEach(testHelper, 25000);

test('returns SC 201 + created user when given a valid payload', async () => {
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const memoToCreate = {
    title: 'best videogames ever',
    content: 'apex legends, minecraft',
    dateCreated: Date.now()
  };

  const { body: createdMemo }: { body: PrettifiedMemo } = await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token}`)
    .send(memoToCreate)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(createdMemo.title).toBe(memoToCreate.title);
  expect(createdMemo.content).toBe(memoToCreate.content);
  expect(createdMemo.dateCreated).toEqual(memoToCreate.dateCreated);

  const memosAfter = (await Memo.find({})) as MemoDoc[];
  const ids = memosAfter.map(memo => memo.id);

  expect(ids).toContain(createdMemo.id);
});

test('returns SC 201 + created user and assigns a default title, content and creation date when given an empty payload', async () => {
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const memoToCreate = {};
  const { body: createdMemo }: { body: PrettifiedMemo } = await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token}`)
    .send(memoToCreate)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(createdMemo.title).toBe('untitled memo');
  expect(createdMemo.content).toBe('');
  expect(createdMemo.dateCreated).toBeTruthy();

  const memosAfter = (await Memo.find({})) as MemoDoc[];
  const ids = memosAfter.map(memo => memo.id);

  expect(ids).toContain(createdMemo.id);
});

// describe('creating a memo with invalid data', () => {}); not necessary, as default values are assigned anyway

test('fails with SC 401 when the token is missing', async () => {
  const memoToCreate = {
    title: 'best videogames ever',
    content: 'apex legends, minecraft',
    dateCreated: Date.now()
  };

  await api
    .post('/api/memos')
    .send(memoToCreate)
    .expect(401)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => await mongoose.connection.close());

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

test('returns SC 200 + deleted memo when the memo id is valid', async () => {
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const memoToDelete = (await Memo.findOne()) as MemoDoc;
  const { id } = memoToDelete;

  const { body: deletedMemo }: { body: PrettifiedMemo } = await api
    .delete(`/api/memos/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(deletedMemo.id).toBe(id);

  const memosAfter = (await Memo.find({})) as MemoDoc[];
  const ids = memosAfter.map(memo => memo.id);

  expect(ids).not.toContain(id);
});
test('fails with SC 404 when the the memo id is invalid', async () => {
  const memosBefore = (await Memo.find({})) as MemoDoc[];

  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  await api
    .delete('/api/memos/nonexistent')
    .set('Authorization', `Bearer ${token}`)
    .expect(404)
    .expect('Content-Type', /application\/json/);

  const memosAfter = (await Memo.find({})) as MemoDoc[];

  expect(memosAfter).toEqual(memosBefore);
});

describe('invalid/missing token', () => {
  test('fails with SC 401 when the token is invalid', async () => {
    const memosBefore = (await Memo.find({})) as MemoDoc[];
    const wrongLogin = { username: 'breezehash', password: 'niemals' };
    const { token: wrongToken } = (
      await api.post('/api/login').send({ ...wrongLogin })
    ).body;

    const memoToDelete = memosBefore[0];
    const { id } = memoToDelete;

    await api
      .delete(`/api/memos/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const memosAfter = (await Memo.find({})) as MemoDoc[];
    expect(memosAfter).toEqual(memosBefore);
  });
  test('fails with SC 401 when the token is missing', async () => {
    const memosBefore = (await Memo.find({})) as MemoDoc[];

    const memoToDelete = memosBefore[0];
    const { id } = memoToDelete;

    await api
      .delete(`/api/memos/${id}`)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const memosAfter = (await Memo.find({})) as MemoDoc[];
    expect(memosAfter).toEqual(memosBefore);
  });
});

afterAll(async () => await mongoose.connection.close());

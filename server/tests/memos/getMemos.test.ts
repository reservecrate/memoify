import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../../app.ts';
import Memo from '../../models/memo.ts';
import User from '../../models/user.ts';
import { MemoDoc, PrettifiedMemo } from '../../interfaces/memo.ts';

// tests fetch the raw data and prettify it themselves; the controllers should return the prettified data ready to be consumed by the frontend; the tests make sure the controllers prettify the raw data in the desired/correct format

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

describe('fetching all memos', () => {
  beforeEach(testHelper, 25000);

  test('returns SC 200 + all memos prettified and in the correct order', async () => {
    const { body: memos }: { body: PrettifiedMemo[] } = await api
      .get('/api/memos')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(memos[0].title).toBe('reservecrate title 1');
    expect(memos[0].author.username).toBe('reservecrate');
    expect(memos[3].content).toBe('breezehash content 2');
    expect(memos[3].author.name).toBe('Joel');
  });
});

describe('fetching a single memo', () => {
  beforeEach(testHelper, 25000);

  // test('returns SC 200 + correct raw memo when given a valid id',async()=>{

  // })

  test('returns SC 200 + correct prettified memo when given a valid id', async () => {
    const memos: MemoDoc[] = await Memo.find({});
    const id1 = memos[0].id;
    const id2 = memos[1].id;

    const memoToFetch1 = (await Memo.findById(id1)) as MemoDoc;
    const { body: fetchedMemo1 } = await api
      .get(`/api/memos/${id1}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(fetchedMemo1.title).toBe(memoToFetch1.title);
    expect(fetchedMemo1.dateCreated).toBe(memoToFetch1.dateCreated);

    const memoToFetch2 = (await Memo.findById(id2)) as MemoDoc;
    const { body: fetchedMemo2 } = await api
      .get(`/api/memos/${id2}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(fetchedMemo2.title).toBe(memoToFetch2.title);
    expect(fetchedMemo2.dateCreated).toBe(memoToFetch2.dateCreated);
  }, 10000);
  test('fails with SC 404 when given nonexistent id', async () => {
    await api
      .get('/api/memos/nonexistent')
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });
});

test('fetching an empty array of memos', async () => {
  await Memo.deleteMany({});
  const { body: memos } = await api
    .get('/api/memos')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(memos).toEqual([]);
});

afterAll(async () => await mongoose.connection.close());

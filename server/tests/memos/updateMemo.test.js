const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);
const Memo = require('../../models/memo');
const User = require('../../models/user');
const { getAllMemos } = require('../../utils/api_helper');

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

test('returns SC 200 + updated memo when updating the title/content', async () => {
  const memosBefore = await getAllMemos();
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const { id } = memosBefore[0];
  const { body } = await api.get(`/api/memos/${id}`);
  const { memo: memoToUpdate } = body;
  const updatedMemoPayload = { ...memoToUpdate, content: 'UU RR' };

  const { body: updatedMemo } = await api
    .put(`/api/memos/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedMemoPayload)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(updatedMemo.content).toBe(updatedMemoPayload.content);

  const memosAfter = await getAllMemos();
  expect(memosAfter).toHaveLength(memosBefore.length);
  expect(memosAfter).toContainEqual(updatedMemo);
});

test('returns SC 200 + updated memo when updating the title and content simultaneously', async () => {
  const memosBefore = await getAllMemos();
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const { id } = memosBefore[0];
  const { body } = await api.get(`/api/memos/${id}`);
  const { memo: memoToUpdate } = body;

  const updatedMemoPayload = {
    ...memoToUpdate,
    title: 'Merkzettel 1',
    content: 'etwas etwas'
  };

  const { body: updatedMemo } = await api
    .put(`/api/memos/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(updatedMemoPayload)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(updatedMemo.title).toBe(updatedMemoPayload.title);
  expect(updatedMemo.content).toBe(updatedMemoPayload.content);

  const memosAfter = await getAllMemos();
  expect(memosAfter).toHaveLength(memosBefore.length);
  expect(memosAfter).toContainEqual(updatedMemo);
}, 10000);

test('fails with SC 404 when the memo id is invalid', async () => {
  const memosBefore = await getAllMemos();
  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const { id } = memosBefore[0];
  const { body } = await api.get(`/api/memos/${id}`);
  const { memo: memoToUpdate } = body;

  const updatedMemoPayload = {
    ...memoToUpdate,
    title: 'Merkzettel 1',
    content: 'etwas etwas'
  };

  await api
    .put('/api/memos/nonexistent')
    .set('Authorization', `Bearer ${token}`)
    .send(updatedMemoPayload)
    .expect(404)
    .expect('Content-Type', /application\/json/);

  const memosAfter = await getAllMemos();
  expect(memosAfter).toEqual(memosBefore);
});

describe('invalid/missing token', () => {
  test('fails with SC 401 when the token is invalid', async () => {
    const memosBefore = await getAllMemos();
    const wrongLogin = { username: 'breezehash', password: 'niemals' };
    const { token: wrongToken } = (
      await api.post('/api/login').send({ ...wrongLogin })
    ).body;

    const { id } = memosBefore[0];
    const { body } = await api.get(`/api/memos/${id}`);
    const { memo: memoToUpdate } = body;

    const updatedMemoData = {
      ...memoToUpdate,
      title: 'Merkzettel 1',
      content: 'etwas etwas'
    };

    await api
      .put(`/api/memos/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .send(updatedMemoData)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const memosAfter = await getAllMemos();
    expect(memosAfter).toEqual(memosBefore);
  });
  test('fails with SC 401 when the token is missing', async () => {
    const memosBefore = await getAllMemos();

    const { id } = memosBefore[0];
    const { body } = await api.get(`/api/memos/${id}`);
    const { memo: memoToUpdate } = body;

    const updatedMemoData = {
      ...memoToUpdate,
      title: 'Merkzettel 1',
      content: 'etwas etwas'
    };

    await api
      .put(`/api/memos/${id}`)
      .send(updatedMemoData)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const memosAfter = await getAllMemos();
    expect(memosAfter).toEqual(memosBefore);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

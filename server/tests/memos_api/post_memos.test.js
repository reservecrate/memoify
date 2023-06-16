const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);
const Memo = require('../../models/memo');
const User = require('../../models/user');
const { getAllMemos, prettifyMemo } = require('../../utils/api_helper');

beforeEach(async () => {
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
}, 50000);

describe('creating a memo with valid data', () => {
  test('returns SC 201 + created user when given valid data', async () => {
    const memosBefore = await getAllMemos();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const memoToCreate = {
      title: 'best videogames ever',
      content: 'apex legends, minecraft',
      dateCreated: Date.now()
    };

    const { body: createdMemo } = await api
      .post('/api/memos')
      .set('Authorization', `Bearer ${token}`)
      .send(memoToCreate)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const prettifiedCreatedMemo = prettifyMemo(createdMemo);

    expect(createdMemo.title).toBe(memoToCreate.title);
    expect(createdMemo.content).toBe(memoToCreate.content);
    expect(createdMemo.dateCreated).toBe(memoToCreate.dateCreated);

    const memosAfter = await getAllMemos();
    expect(memosAfter).toHaveLength(memosBefore.length + 1);
    expect(memosAfter).toContainEqual(prettifiedCreatedMemo);
  });
  test('returns SC 201 + created user and assigns a default title, content and creation date when not given any data', async () => {
    const memosBefore = await getAllMemos();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const memoToCreate = {};
    const { body: createdMemo } = await api
      .post('/api/memos')
      .set('Authorization', `Bearer ${token}`)
      .send(memoToCreate)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const prettifiedCreatedMemo = prettifyMemo(createdMemo);

    expect(createdMemo.title).toBe('untitled memo');
    expect(createdMemo.content).toBe('');

    const memosAfter = await getAllMemos();
    expect(memosAfter).toHaveLength(memosBefore.length + 1);
    expect(memosAfter).toContainEqual(prettifiedCreatedMemo);
  });
});
// describe('creating a memo with invalid data', () => {}); not necessarily necessary, as default values are assigned

afterAll(async () => {
  await mongoose.connection.close();
});

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);
const Memo = require('../../models/memo');
const User = require('../../models/user');

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
  const memosBefore = (
    await Memo.find({}).populate('user', { username: 1, name: 1 })
  ).map(memo => memo.prettify());

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

  expect(createdMemo.title).toBe(memoToCreate.title);
  expect(createdMemo.content).toBe(memoToCreate.content);
  expect(createdMemo.dateCreated).toEqual(memoToCreate.dateCreated);

  const memosAfter = (
    await Memo.find({}).populate('user', { username: 1, name: 1 })
  ).map(memo => memo.prettify());
  expect(memosAfter).toHaveLength(memosBefore.length + 1);
  expect(memosAfter).toContainEqual(createdMemo);
});
test('returns SC 201 + created user and assigns a default title, content and creation date when given an empty payload', async () => {
  const memosBefore = (
    await Memo.find({}).populate('user', { username: 1, name: 1 })
  ).map(memo => memo.prettify());

  const login = { username: 'reservecrate', password: 'kennwort' };
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const memoToCreate = {};
  const { body: createdMemo } = await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token}`)
    .send(memoToCreate)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  expect(createdMemo.title).toBe('untitled memo');
  expect(createdMemo.content).toBe('');

  const memosAfter = (
    await Memo.find({}).populate('user', { username: 1, name: 1 })
  ).map(memo => memo.prettify());
  expect(memosAfter).toHaveLength(memosBefore.length + 1);
  expect(memosAfter).toContainEqual(createdMemo);
});

// describe('creating a memo with invalid data', () => {}); not necessary, as default values are assigned anyway

test('fails with SC 401 when the token is missing', async () => {
  const memosBefore = await Memo.find({});

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

  const memosAfter = await Memo.find({});
  expect(memosAfter).toEqual(memosBefore);
});

afterAll(async () => {
  await mongoose.connection.close();
});

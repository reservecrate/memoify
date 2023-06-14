const { log } = require('console');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Memo = require('../models/memo');
const User = require('../models/user');
const { getAllMemos, getMemoById } = require('../utils/api_helper');

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

  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      title: 'test note 1',
      content: 'placeholder 1',
      dateCreated: Date.now()
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      title: 'test note 2',
      content: 'placeholder 2',
      dateCreated: Date.now()
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      title: 'test note 3',
      content: 'placeholder 3',
      dateCreated: Date.now()
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
  await api
    .post('/api/memos')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      title: 'test note 4',
      content: 'placeholder 4',
      dateCreated: Date.now()
    })
    .expect(201)
    .expect('Content-Type', /application\/json/);
}, 50000);

describe('fetching the memos', () => {
  describe('fetching all memos', () => {
    test('returns SC 200 + all memos in the correct order', async () => {
      const { body: memosList } = await api
        .get('/api/memos')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const memos = await getAllMemos();
      expect(memosList).toEqual(memos);
      expect(memos[0].title).toBe('test note 1');
      expect(memos[2].content).toBe('placeholder 3');
    });
  });
  describe('fetching a single memo', () => {
    test('returns SC 200 + correct memo when given a valid id', async () => {
      const memos = await getAllMemos();

      const memoToFetch1 = await getMemoById(memos[0].id);
      const { id: id1 } = memoToFetch1;
      const { body: fetchedMemo1 } = await api
        .get(`/api/memos/${id1}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(fetchedMemo1).toEqual(memoToFetch1);

      const memoToFetch2 = await getMemoById(memos[2].id);
      const { id: id2 } = memoToFetch2;
      const { body: fetchedMemo2 } = await api
        .get(`/api/memos/${id2}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(fetchedMemo2).toEqual(memoToFetch2);
    });
    test('returns SC 404 when given nonexistent id', async () => {
      await api
        .get('/api/memos/nonexistent')
        .expect(404)
        .expect('Content-Type', /application\/json/);
    });
  });
});

describe('creating memos', () => {
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

      expect(createdMemo.title).toBe(memoToCreate.title);
      expect(createdMemo.content).toBe(memoToCreate.content);
      expect(createdMemo.dateCreated).toBe(memoToCreate.dateCreated);

      const memosAfter = await getAllMemos();
      expect(memosAfter).toHaveLength(memosBefore.length + 1);
      expect(memosAfter).toContainEqual(createdMemo);
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

      expect(createdMemo.title).toBe('untitled memo');
      expect(createdMemo.content).toBe('');

      const memosAfter = await getAllMemos();
      expect(memosAfter).toHaveLength(memosBefore.length + 1);
      expect(memosAfter).toContainEqual(createdMemo);
    });
  });
  describe('creating a memo with invalid data', () => {});
});

describe('updating memos',()=>{
  test.only()
})

afterAll(async () => {
  await mongoose.connection.close();
});

const { log } = require('console');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Memo = require('../models/memo');
const User = require('../models/user');
const {
  getAllMemos,
  getMemoById,
  memosPrettifier,
  memoPrettifier
} = require('../utils/api_helper');

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

describe.only('fetching the memos', () => {
  describe('fetching all memos', () => {
    test('returns SC 200 + all memos in the correct order', async () => {
      const allMemos = await getAllMemos();

      //let memos and then change the value???
      const { body: memos } = await api
        .get('/api/memos')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(memosPrettifier(memos)).toEqual(allMemos);
      expect(memos[0].title).toBe('test memo 1');
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
      expect(memoPrettifier(fetchedMemo1)).toEqual(memoToFetch1);

      const memoToFetch2 = await getMemoById(memos[2].id);
      const { id: id2 } = memoToFetch2;
      const { body: fetchedMemo2 } = await api
        .get(`/api/memos/${id2}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      expect(memoPrettifier(fetchedMemo2)).toEqual(memoToFetch2);
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

describe('updating memos', () => {
  test('returns SC 200 + updated memo when updating the title with a valid token', async () => {
    const memosBefore = await getAllMemos();
    const login = { username: 'reservecrate', password: 'kennwort' };
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const memoToUpdate = memosBefore[0];
    const { id } = memoToUpdate;
    const updatedMemoData = { ...memoToUpdate, title: 'eine Notiz 1' };

    const { body: updatedMemo } = await api
      .put(`/api/memos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMemoData)
      //   //send({updatedMemoData}) ?????
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .catch(err => log(err));

    expect(updatedMemo.title).toBe(updatedMemoData.title);

    const memosAfter = await getAllMemos();
    expect(memosAfter).toHaveLength(memosBefore.length);
    expect(memosAfter).toContainEqual(updatedMemo);
  });
  test('invalid token, any modification to the memo', async () => {});
  test('missing token, any modification', async () => {});
});

afterAll(async () => {
  await mongoose.connection.close();
});

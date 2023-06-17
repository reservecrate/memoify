const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);
const Memo = require('../../models/memo');
const User = require('../../models/user');
const {
  getAllMemos,
  getMemoById,
  prettifyMemos,
  prettifyMemo
} = require('../../utils/api_helper');

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

describe('fetching all memos', () => {
  test('returns SC 200 + all memos in the correct order', async () => {
    const allMemos = await getAllMemos();

    const { body: memos } = await api
      .get('/api/memos')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedMemos = prettifyMemos(memos);

    expect(prettifiedMemos).toEqual(allMemos);
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
    const prettifiedFetchedMemo1 = prettifyMemo(fetchedMemo1);
    expect(prettifiedFetchedMemo1).toEqual(memoToFetch1);

    const memoToFetch2 = await getMemoById(memos[2].id);
    const { id: id2 } = memoToFetch2;
    const { body: fetchedMemo2 } = await api
      .get(`/api/memos/${id2}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const prettifiedFetchedMemo2 = prettifyMemo(fetchedMemo2);
    expect(prettifiedFetchedMemo2).toEqual(memoToFetch2);
  });
  test('returns SC 404 when given nonexistent id', async () => {
    await api
      .get('/api/memos/nonexistent')
      .expect(404)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
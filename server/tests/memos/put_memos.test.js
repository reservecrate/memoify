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

test.only('returns SC 200 + updated memo when updating the title or content (one at a time) with a valid token', async () => {
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
    .expect(200)
    .expect('Content-Type', /application\/json/)
    .catch(err => console.log(err));
  const prettifiedUpdatedMemo = prettifyMemo(updatedMemo);

  expect(updatedMemo.title).toBe(updatedMemoData.title);

  const memosAfter = await getAllMemos();
  expect(memosAfter).toHaveLength(memosBefore.length);
  expect(memosAfter).toContainEqual(prettifiedUpdatedMemo);
});
// test('returns SC 200 + updated memo when updating the title and content simultaneously with a valid token', async () => {});
// test('invalid token, any modification to the memo', async () => {});
// test('missing token, any modification', async () => {});

afterAll(async () => {
  await mongoose.connection.close();
});

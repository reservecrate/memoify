const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Memo = require('../models/memo');
const User = require('../models/user');

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

beforeEach(testHelper, 25000);

test.only('returns SC 200 + correct memos in the correct order when given a valid username (author)', async () => {
  const username = 'reservecrate';
  const allMemosByAuthor = (
    await Memo.find({}).populate('user', {
      username: 1,
      name: 1
    })
  )
    .map(memo => memo.prettify())
    .filter(memo => memo.author.username === username);

  const { body: memosByAuthor } = await api
    .get(`/${username}/memos`)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  expect(memosByAuthor).toEqual(allMemosByAuthor);
  expect(memosByAuthor[0].title).toBe('reservecrate title 1');
  expect(memosByAuthor[1].content).toBe('reservecrate content 2');
});

//write additional tests later

afterAll(async () => {
  await mongoose.connection.close();
});

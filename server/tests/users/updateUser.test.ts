import { describe, expect, test, beforeEach, afterAll } from '@jest/globals';
import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app.ts';
import User from '../../models/user.ts';
import { UserDoc } from '../../interfaces/user.ts';

const api = supertest(app);

const testHelper = async () => {
  await User.deleteMany({});

  const saltRounds = 10;
  const rootPasswordHash = await bcrypt.hash('supremepassword', saltRounds);
  const rootUser = new User({
    username: 'root',
    name: 'admin',
    passwordHash: rootPasswordHash
  }) as unknown as UserDoc;
  await rootUser.save();

  const passwordHash1 = await bcrypt.hash('kennwort', saltRounds);
  const user1 = new User({
    username: 'reservecrate',
    name: 'Aldi',
    passwordHash: passwordHash1
  }) as unknown as UserDoc;
  await user1.save();
  // .saveMany([])

  const passwordHash2 = await bcrypt.hash('niemals', saltRounds);
  const user2 = new User({
    username: 'breezehash',
    name: 'Joel',
    passwordHash: passwordHash2
  }) as unknown as UserDoc;
  await user2.save();

  const passwordHash3 = await bcrypt.hash('lecso', saltRounds);
  const user3 = new User({
    username: 'wirelessspice',
    name: 'Gabor',
    passwordHash: passwordHash3
  }) as unknown as UserDoc;
  await user3.save();
};

beforeEach(testHelper, 25000);

describe('updating the name', () => {
  test.only('returns SC 200 + updated user when the update payload is valid', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, name: 'Aldiyar' };
    // const { body: updatedUser } = await api
    const { body } = await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      // .expect(200)
      .expect('Content-Type', /application\/json/);
    console.log(body);

    // expect(updatedUser.name).toBe(updatedUserData.name);

    // const usersAfter: UserDoc[] = await User.find({});
    // const names = usersAfter.map(user => user.name);

    // expect(names).not.toContain(userToUpdate.name);
    // expect(names).toContain(updatedUser.name);
  });
  test('fails with SC 400 if the new name is an emptry string/whitespace', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, name: '  ' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const names = usersAfter.map(user => user.name);

    expect(names).toContain(userToUpdate.name);
  });
});
describe('updating the username', () => {
  test('returns SC 200 + updated user when the update payload is valid', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, username: 'reservecase' };
    const { body: updatedUser } = await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedUser.username).toBe(updatedUserData.username);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).not.toContain(userToUpdate.username);
    expect(usernames).toContain(updatedUser.username);
  });
  test('fails with SC 400 if the new username is shorter than 3 characters', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, username: 're' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).toContain(userToUpdate.username);
  });
});

//UNDER MAINTENANCE, RENOVATE THE DESCRIBE BLOCK LATER TO PROPERLY CHECK WHETHER THE PASSWORD HAS BEEN UPDATED
describe.skip('updating the password', () => {
  test('returns SC 200 + updated user when the update payload is valid', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, password: 'geenword' };
    const { body: updatedUser } = await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'password' })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
  });
  test('fails with SC 400 if the new password is shorter than 5 characters (token is valid)', async () => {
    const usersBefore: UserDoc[] = await User.find({});
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;

    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = { ...userToUpdate, password: 'geen' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'password' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    expect(usersAfter).toEqual(usersBefore);
  });
});

//UNDER MAINTENANCE
describe.skip('updating multiple values (name, username, password) simultaneously ', () => {
  test("fails with SC 400 when the user attempts to update multiple values simultaneously (using the 'name' flag)", async () => {
    const usersBefore: UserDoc[] = await User.find({});
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = {
      ...userToUpdate,
      name: 'Aldiyar',
      username: 'reservecase',
      password: 'geenword'
    };

    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    expect(usersAfter).toEqual(usersBefore);
  });
  test("fails with SC 400 when the user attempts to update multiple values simultaneously (using the 'username' flag)", async () => {
    const usersBefore: UserDoc[] = await User.find({});
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = {
      ...userToUpdate,
      name: 'Aldiyar',
      username: 'reservecase',
      password: 'geenword'
    };

    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    expect(usersAfter).toEqual(usersBefore);
  });
  test("fails with SC 400 when the user attempts to update multiple values simultaneously (using the 'password' flag)", async () => {
    const usersBefore: UserDoc[] = await User.find({});
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;

    const { id } = userToUpdate;
    const { token } = (await api.post('/api/login').send({ ...login })).body;

    const updatedUserData = {
      ...userToUpdate,
      name: 'Aldiyar',
      username: 'reservecase',
      password: 'geenword'
    };

    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ updatedUserData, toUpdate: 'password' })
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    expect(usersAfter).toEqual(usersBefore);
  });
});

test('fails with SC 400 when the update flag (toUpdate) is invalid/missing', async () => {
  const login = { username: 'reservecrate', password: 'kennwort' };

  const userToUpdate = (await User.findOne({
    username: login.username
  })) as UserDoc;

  const { id } = userToUpdate;
  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const updatedUserData = { ...userToUpdate, username: 'reservecase' };
  await api
    .put(`/api/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ updatedUserData })
    .expect(400)
    .expect('Content-Type', /application\/json/);

  const usersAfter: UserDoc[] = await User.find({});
  const usernames = usersAfter.map(user => user.username);

  expect(usernames).toContain(userToUpdate.username);
});

test('fails with SC 404 when the user id is invalid', async () => {
  const login = { username: 'reservecrate', password: 'kennwort' };

  const userToUpdate = (await User.findOne({
    username: login.username
  })) as UserDoc;

  const { token } = (await api.post('/api/login').send({ ...login })).body;

  const updatedUserData = { ...userToUpdate, name: 'Aldiyar' };
  await api
    .put('/api/users/doesnotexist')
    .set('Authorization', `Bearer ${token}`)
    .send({ updatedUserData, toUpdate: 'name' })
    .expect(404)
    .expect('Content-Type', /application\/json/);

  const usersAfter: UserDoc[] = await User.find({});
  const names = usersAfter.map(user => user.name);

  expect(names).toContain(userToUpdate.name);
});

describe('invalid/missing token', () => {
  test('fails with SC 401 when the token is invalid', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };
    const wrongLogin = { username: 'breezehash', password: 'niemals' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;
    const { id } = userToUpdate;
    const { token: wrongToken } = (
      await api.post('/api/login').send({ ...wrongLogin })
    ).body;

    const updatedUserData = { ...userToUpdate, name: 'Aldiyar' };
    await api
      .put(`/api/users/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .send({ updatedUserData, toUpdate: 'name' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const names = usersAfter.map(user => user.name);

    expect(names).toContain(userToUpdate.name);
  });
  test('fails with SC 401 when the token is missing', async () => {
    const login = { username: 'reservecrate', password: 'kennwort' };

    const userToUpdate = (await User.findOne({
      username: login.username
    })) as UserDoc;

    const { id } = userToUpdate;

    const updatedUserData = { ...userToUpdate, username: 'reservecase' };
    await api
      .put(`/api/users/${id}`)
      .send({ updatedUserData, toUpdate: 'username' })
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const usersAfter: UserDoc[] = await User.find({});
    const usernames = usersAfter.map(user => user.username);

    expect(usernames).toContain(userToUpdate.username);
  });
});

afterAll(async () => await mongoose.connection.close());

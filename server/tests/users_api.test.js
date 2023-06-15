const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const {
  getAllUsers,
  getByUsername,
  // getUserById
  usersPrettifier,
  userPrettifier
} = require('../utils/api_helper');

beforeEach(async () => {
  await User.deleteMany({});

  const saltRounds = 10;
  const rootPasswordHash = await bcrypt.hash('supremepassword', saltRounds);
  const rootUser = new User({
    username: 'root',
    name: 'admin',
    passwordHash: rootPasswordHash
  });
  await rootUser.save();

  const passwordHash1 = await bcrypt.hash('kennwort', saltRounds);
  const user1 = new User({
    username: 'reservecrate',
    name: 'Aldi',
    passwordHash: passwordHash1
  });
  await user1.save();

  const passwordHash2 = await bcrypt.hash('niemals', saltRounds);
  const user2 = new User({
    username: 'breezehash',
    name: 'Joel',
    passwordHash: passwordHash2
  });
  await user2.save();

  const passwordHash3 = await bcrypt.hash('lecso', saltRounds);
  const user3 = new User({
    username: 'wirelessspice',
    name: 'Gabor',
    passwordHash: passwordHash3
  });
  await user3.save();
}, 50000);

describe('fetching the users', () => {
  describe('fetching all users', () => {
    test('returns SC 200 + all users in the correct order', async () => {
      const allUsers = await getAllUsers();

      const { body: users } = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const prettifiedUsers = usersPrettifier(users);

      expect(prettifiedUsers).toEqual(allUsers);
      expect(users[1].username).toBe('reservecrate');
      expect(users[2].name).toBe('Joel');
    });
  });
  describe('fetching a single user', () => {
    test('returns SC 200 + the right user when given a valid id', async () => {
      const userToFetch1 = await getByUsername('reservecrate');
      const { body: fetchedUser1 } = await api
        .get(`/api/users/${userToFetch1.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const prettifiedFetchedUser1 = userPrettifier(fetchedUser1);
      expect(prettifiedFetchedUser1).toEqual(userToFetch1);

      const userToFetch2 = await getByUsername('wirelessspice');
      const { body: fetchedUser2 } = await api
        .get(`/api/users/${userToFetch2.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);
      const prettifiedFetchedUser2 = userPrettifier(fetchedUser2);
      expect(prettifiedFetchedUser2).toEqual(userToFetch2);
    });
    test('fails with SC 404 when given nonexistent id', async () => {
      await api
        .get('/api/users/nonexistent')
        .expect(404)
        .expect('Content-Type', /application\/json/);
    });
  });
});

// describe('creating users', () => {
//   describe('creating a user with valid data', () => {
//     test('returns SC 201 + created user when given a valid username + password', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         username: 'theelx',
//         name: 'Jonah',
//         password: 'pythonista'
//       };

//       const { body: createdUser } = await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(201)
//         .expect('Content-Type', /application\/json/);

//       expect(createdUser.username).toBe(userToCreate.username);
//       expect(createdUser.name).toBe(userToCreate.name);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length + 1);
//       expect(usersAfter).toContainEqual(createdUser);
//     });

//     test('if name not given, assigns a default one (Incognito); returns SC 201 + created user', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         username: 'theelx',
//         password: 'pythonista'
//       };

//       const { body: createdUser } = await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(201)
//         .expect('Content-Type', /application\/json/);

//       expect(createdUser.username).toBe(userToCreate.username);
//       expect(createdUser.name).toBe('Incognito');

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length + 1);
//       expect(usersAfter).toContainEqual(createdUser);
//     });
//   });

//   describe('creating a user with invalid data', () => {
//     test('fails with SC 400 if the username is shorter than 3 characters', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         username: 'tx',
//         name: 'Jonah',
//         password: 'pythonista'
//       };

//       await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       const usernames = usersAfter.map(user => user.username);
//       expect(usersAfter).toHaveLength(usersBefore.length);
//       expect(usernames).not.toContain(userToCreate.username);
//     });
//     test('fails with SC 400 if the password is shorter than 5 characters', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         username: 'theelx',
//         name: 'Jonah',
//         password: 'pyth'
//       };

//       await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       const usernames = usersAfter.map(user => user.username);
//       expect(usersAfter).toHaveLength(usersBefore.length);
//       expect(usernames).not.toContain(userToCreate.username);
//     });
//     test('fails with SC 400 if the username is already taken', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         username: 'breezehash',
//         name: 'Joel',
//         password: 'jemals'
//       };

//       await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length);
//     });
//   });

//   describe('creating a user with missing data', () => {
//     test('fails with SC 400 if the username is missing', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         name: 'Jonah',
//         password: 'pythonista'
//       };

//       await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length);
//     });
//     test('fails with SC 400 if the password is missing', async () => {
//       const usersBefore = await getAllUsers();

//       const userToCreate = {
//         username: 'theelx',
//         name: 'Jonah'
//       };

//       await api
//         .post('/api/users')
//         .send(userToCreate)
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length);
//     });
//   });
// });

// describe('updating users', () => {
//   describe('updating the username', () => {
//     test('returns SC 200 + updated user when the token is valid', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token } = (await api.post('/api/login').send({ ...login })).body;

//       const updatedUserData = { ...userToUpdate, username: 'reservecase' };
//       const { body: updatedUser } = await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ updatedUserData, toUpdate: 'username' })
//         .expect(200)
//         .expect('Content-Type', /application\/json/);

//       expect(updatedUser.username).toBe(updatedUserData.username);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length);
//       expect(usersAfter).toContainEqual(updatedUser);
//     });
//     test('fails with SC 401 when the token is invalid', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const wrongLogin = { username: 'breezehash', password: 'niemals' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token: wrongToken } = (
//         await api.post('/api/login').send({ ...wrongLogin })
//       ).body;

//       const updatedUserData = { ...userToUpdate, username: 'reservecase' };
//       await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${wrongToken}`)
//         .send({ updatedUserData, toUpdate: 'username' })
//         .expect(401)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//     test('fails with SC 401 when the token is missing', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;

//       const updatedUserData = { ...userToUpdate, username: 'reservecase' };
//       await api
//         .put(`/api/users/${id}`)
//         .send({ updatedUserData, toUpdate: 'username' })
//         .expect(401)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//     test('fails with SC 400 if the new username is shorter than 3 characters (token is valid)', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token } = (await api.post('/api/login').send({ ...login })).body;

//       const updatedUserData = { ...userToUpdate, username: 're' };
//       await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ updatedUserData, toUpdate: 'username' })
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//   });
//   describe('updating the password', () => {
//     test('returns SC 200 + updated user when the token is valid', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token } = (await api.post('/api/login').send({ ...login })).body;

//       const updatedUserData = { ...userToUpdate, password: 'geenword' };
//       const { body: updatedUser } = await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ updatedUserData, toUpdate: 'password' })
//         .expect(200)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toHaveLength(usersBefore.length);
//       expect(usersAfter).toContainEqual(updatedUser);
//     });
//     test('fails with SC 401 when the token is invalid', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const wrongLogin = { username: 'breezehash', password: 'niemals' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token: wrongToken } = (
//         await api.post('/api/login').send({ ...wrongLogin })
//       ).body;

//       const updatedUserData = { ...userToUpdate, password: 'geenword' };
//       await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${wrongToken}`)
//         .send({ updatedUserData, toUpdate: 'password' })
//         .expect(401)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//     test('fails with SC 401 when the token is missing', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;

//       const updatedUserData = { ...userToUpdate, password: 'geenword' };
//       await api
//         .put(`/api/users/${id}`)
//         .send({ updatedUserData, toUpdate: 'password' })
//         .expect(401)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//     test('fails with SC 400 if the new password is shorter than 5 characters (token is valid)', async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token } = (await api.post('/api/login').send({ ...login })).body;

//       const updatedUserData = { ...userToUpdate, password: 'geen' };
//       await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ updatedUserData, toUpdate: 'password' })
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//   });
//   describe('updating username + password simultaneously', () => {
//     test("fails with SC 400 if the user attempts to edit the username + password simultaneously (using the 'username' flag)", async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token } = (await api.post('/api/login').send({ ...login })).body;

//       const updatedUserData = {
//         ...userToUpdate,
//         username: 'reservecase',
//         password: 'geenword'
//       };

//       await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ updatedUserData, toUpdate: 'username' })
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//     test("fails with SC 400 when the user attempts to edit the username + password simultaneously (using the 'password' flag)", async () => {
//       const usersBefore = await getAllUsers();
//       const login = { username: 'reservecrate', password: 'kennwort' };
//       const userToUpdate = await getByUsername(login.username);
//       const { id } = userToUpdate;
//       const { token } = (await api.post('/api/login').send({ ...login })).body;

//       const updatedUserData = {
//         ...userToUpdate,
//         username: 'reservecase',
//         password: 'geenword'
//       };

//       await api
//         .put(`/api/users/${id}`)
//         .set('Authorization', `Bearer ${token}`)
//         .send({ updatedUserData, toUpdate: 'password' })
//         .expect(400)
//         .expect('Content-Type', /application\/json/);

//       const usersAfter = await getAllUsers();
//       expect(usersAfter).toEqual(usersBefore);
//     });
//   });
//   test('fails with SC 400 when the update flag (toUpdate) is invalid/missing', async () => {
//     const usersBefore = await getAllUsers();
//     const login = { username: 'reservecrate', password: 'kennwort' };
//     const userToUpdate = await getByUsername(login.username);
//     const { id } = userToUpdate;
//     const { token } = (await api.post('/api/login').send({ ...login })).body;

//     const updatedUserData = { ...userToUpdate, username: 'reservecase' };
//     await api
//       .put(`/api/users/${id}`)
//       .set('Authorization', `Bearer ${token}`)
//       .send({ updatedUserData })
//       .expect(400)
//       .expect('Content-Type', /application\/json/);

//     const usersAfter = await getAllUsers();
//     expect(usersAfter).toEqual(usersBefore);
//   });
// });

// describe('deleting users', () => {
//   test('returns SC 200 + deleted user when the token is valid', async () => {
//     const usersBefore = await getAllUsers();
//     const login = { username: 'reservecrate', password: 'kennwort' };
//     const userToDelete = await getByUsername(login.username);
//     const { id } = userToDelete;
//     const { token } = (await api.post('/api/login').send({ ...login })).body;

//     const { body: deletedUser } = await api
//       .delete(`/api/users/${id}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(200)
//       .expect('Content-Type', /application\/json/);

//     const usersAfter = await getAllUsers();
//     expect(deletedUser).toEqual(userToDelete);
//     expect(usersAfter).toHaveLength(usersBefore.length - 1);
//     expect(usersAfter).not.toContainEqual(deletedUser);
//   });
//   test('fails with SC 401 when the token is invalid', async () => {
//     const usersBefore = await getAllUsers();
//     const login = { username: 'reservecrate', password: 'kennwort' };
//     const wrongLogin = { username: 'breezehash', password: 'niemals' };
//     const userToDelete = await getByUsername(login.username);
//     const { id } = userToDelete;
//     const { token: wrongToken } = (
//       await api.post('/api/login').send({ ...wrongLogin })
//     ).body;

//     await api
//       .delete(`/api/users/${id}`)
//       .set('Authorization', `Bearer ${wrongToken}`)
//       .expect(401)
//       .expect('Content-Type', /application\/json/);

//     const usersAfter = await getAllUsers();
//     expect(usersAfter).toHaveLength(usersBefore.length);
//     expect(usersAfter).toContainEqual(userToDelete);
//   });
//   test('fails with SC 401 when the token is missing', async () => {
//     const usersBefore = await getAllUsers();
//     const login = { username: 'reservecrate', password: 'kennwort' };
//     const userToDelete = await getByUsername(login.username);
//     const { id } = userToDelete;

//     await api
//       .delete(`/api/users/${id}`)
//       .expect(401)
//       .expect('Content-Type', /application\/json/);

//     const usersAfter = await getAllUsers();
//     expect(usersAfter).toEqual(usersBefore);
//     expect(usersAfter).toContainEqual(userToDelete);
//   });
// });

afterAll(async () => {
  await mongoose.connection.close();
});

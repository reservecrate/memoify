const usersRouter = require('express').Router();
const { getUsers, getUser } = require('./getUsers');
const postUser = require('./postUser');
const putUser = require('./putUser');
const deleteUser = require('./deleteUser');

usersRouter.get('/', getUsers);

usersRouter.get('/:id', getUser);

usersRouter.post('/', postUser);

usersRouter.put('/:id', putUser);

usersRouter.delete('/:id', deleteUser);

module.exports = usersRouter;

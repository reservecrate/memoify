import { Router } from 'express';
// import { getUsers, getUser } from './getUsers.ts';
import createUser from './createUser.ts';
import updateUser from './updateUser.ts';
import deleteUser from './deleteUser.ts';

const usersRouter = Router();

// usersRouter.get('/', getUsers);

// usersRouter.get('/:id', getUser);

usersRouter.post('/', createUser);

usersRouter.put('/:id', updateUser);

usersRouter.delete('/:id', deleteUser);

export default usersRouter;

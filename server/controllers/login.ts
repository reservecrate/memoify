import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/user.js';
import { UserDoc } from '../interfaces/user.ts';

const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  const { username: reqUsername, password: reqPassword } = req.body;

  if (!(reqUsername && reqPassword))
    return res.status(400).json({ error: 'username/password not given' });

  const user = (await User.findOne({ username: reqUsername })) as UserDoc;

  const passwordIsCorrect = !user
    ? false
    : await bcrypt.compare(reqPassword, user.passwordHash);

  if (!(user && passwordIsCorrect))
    return res.status(400).json({
      error: 'invalid username/password'
    });

  const { username, name, id } = user;
  const secret = process.env.SECRET as Secret;
  const token = jwt.sign({ username, id }, secret);
  res.status(200).json({ token, username, name, id });
});

export default loginRouter;

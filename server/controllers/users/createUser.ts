import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/user.ts';
import { UserDoc } from '../../interfaces/user.ts';

const createUser = async (req: Request, res: Response) => {
  const name = req.body.name || 'Incognito';
  const { username, password } = req.body;
  if (!(username && password))
    return res.status(400).json({ error: 'username/password not given' });
  else if (username.length < 3)
    return res
      .status(400)
      .json({ error: 'username must be at least 3 characters long' });
  else if (password.length < 5)
    return res
      .status(400)
      .json({ error: 'password must be at least 5 characters long' });

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const userToCreate = new User({
    username,
    name,
    passwordHash
  }) as unknown as UserDoc;
  const createdUser = await userToCreate.save();
  const { username: createdUsername, name: createdName } = createdUser;
  res.status(201).json({ username: createdUsername, name: createdName });
};

export default createUser;

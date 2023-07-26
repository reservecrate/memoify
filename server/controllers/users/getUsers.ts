import { Request, Response } from 'express';
import User from '../../models/user.ts';
import IUser from '../../interfaces/user.ts';

export const getUsers = async (req: Request, res: Response<IUser[]>) => {
  const users: IUser[] = await User.find({});
  res.status(200).json(users);
};

export const getUser = async (req: Request, res: Response<IUser>) => {
  const { id } = req.params;
  const user = (await User.findById(id)) as IUser;
  res.status(200).json(user);
};

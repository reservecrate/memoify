import { Request, Response } from 'express';
import User from '../../models/user.ts';
import { userExtractor } from '../../utils/api_helper.ts';
import { UserDoc } from '../../interfaces/user.ts';

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  const userToDelete = (await User.findById(userId)) as UserDoc;

  if (!userToDelete)
    return res.status(404).json({ error: 'invalid/nonexistent user id' });

  const user = (await userExtractor(req, res)) as unknown as UserDoc;

  if (!user) return res.status(401).json({ error: 'invalid/missing token' });
  else if (user.id !== userId)
    return res.status(401).json({ error: 'wrong token / user id' });

  const deletedUser = await User.findByIdAndDelete(userId);
  res.status(200).json(deletedUser);
};

export default deleteUser;

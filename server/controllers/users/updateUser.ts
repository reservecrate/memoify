import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../../models/user.ts';
import { userExtractor } from '../../utils/api_helper.ts';
import { UserDoc } from '../../interfaces/user.ts';

const updateUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userToUpdate = (await User.findById(userId)) as UserDoc;
  if (!userToUpdate) return res.status(404).json('invalid/nonexistent user id');

  const user = (await userExtractor(req, res)) as unknown as UserDoc;

  if (!user) return res.status(401).json({ error: 'token not provided' });

  if (user.id !== userToUpdate.id)
    return res.status(401).json({
      error: 'wrong/invalid token (not authorised)'
    });

  const { updatedUserData } = req.body;
  const { toUpdate } = req.body;
  if (!toUpdate)
    return res.status(400).json({
      error:
        "invalid update flag (toUpdate must either be set to 'name', 'username' or 'password'"
    });
  else if (toUpdate === 'name') {
    if (updatedUserData.password || updatedUserData.username !== user.username)
      return res.status(400).json({
        error: 'cannot update name + password/username simultaneously'
      });

    if (!updatedUserData.name.trim())
      return res
        .status(400)
        .json({ error: 'new name must not be an empty string/whitespace' });

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true
    });
    res.status(200).json(updatedUser);
  } else if (toUpdate === 'username') {
    if (updatedUserData.password || updatedUserData.name !== user.name)
      return res.status(400).json({
        error: 'cannot update username + password/name simultaneously'
      });

    if (updatedUserData.username.length < 3)
      return res
        .status(400)
        .json({ error: 'new username must be at least 3 characters long' });

    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true
    });
    res.status(200).json(updatedUser);
  } else if (toUpdate === 'password') {
    if (
      updatedUserData.name !== user.name ||
      updatedUserData.username !== user.username
    )
      return res.status(400).json({
        error: 'cannot update password + name/username simultaneously'
      });

    if (updatedUserData.password.length < 5)
      return res
        .status(400)
        .json({ error: 'new password must be at least 5 characters long' });

    const saltRounds = 10;
    const { password } = updatedUserData;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...updatedUserData, passwordHash },
      { new: true }
    );
    res.status(200).json(updatedUser);
  }
};

export default updateUser;

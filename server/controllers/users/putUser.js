const bcrypt = require('bcrypt');
const User = require('../../models/user');
const { getUserById } = require('../../utils/api_helper');

const putUser = async (req, res) => {
  const userId = req.params.id;
  const userToUpdate = await getUserById(userId);
  if (!userToUpdate) return res.status(404).json('invalid/nonexistent user id');

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'token not given' });
  if (user.id !== userToUpdate.id)
    return res.status(401).json({
      error: 'wrong/invalid token (not authorised)'
    });

  const { updatedUserData } = req.body;
  const { toUpdate } = req.body;
  if (toUpdate === 'name') {
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
    return res.status(200).json(updatedUser);
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
    return res.status(200).json(updatedUser);
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
    return res.status(200).json(updatedUser);
  }
  res.status(400).json({
    error:
      "invalid update flag (toUpdate must either be set to 'name', 'username' or 'password'"
  });
  //move this into an if clause at the top and remove the returns at the bottom of the remaining else if clauses
};

module.exports = putUser;

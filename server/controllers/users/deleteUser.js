const User = require('../../models/user');

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  // eslint-disable-next-line no-unused-vars
  const userToDelete = await User.findById(userId);

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'invalid/missing token' });
  else if (user.id !== userId)
    return res.status(401).json({ error: 'wrong token/user id' });

  const deletedUser = await User.findByIdAndDelete(userId);
  res.status(200).json(deletedUser);
};

module.exports = deleteUser;

const User = require('../../models/user');

const deleteUser = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).json({ error: 'token not given' });
  else if (user.id !== req.params.id)
    return res.status(401).json({ error: 'invalid token/user id' });
  const deletedUser = await User.findByIdAndDelete(user.id);
  res.status(200).json(deletedUser);
};

module.exports = deleteUser;

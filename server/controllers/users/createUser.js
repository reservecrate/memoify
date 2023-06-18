const bcrypt = require('bcrypt');
const User = require('../../models/user');

const createUser = async (req, res) => {
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
  const createdUser = await new User({ username, name, passwordHash }).save();
  res.status(201).json(createdUser);
};

module.exports = createUser;

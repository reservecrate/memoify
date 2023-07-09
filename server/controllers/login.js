const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  const { username: reqUsername, password: reqPassword } = req.body;
  if (!(reqUsername && reqPassword))
    return res.status(400).json({ error: 'username/password not given' });
  const user = await User.findOne({ username: reqUsername });
  const passwordIsCorrect = !user
    ? false
    : await bcrypt.compare(reqPassword, user.passwordHash);
  if (!(user && passwordIsCorrect))
    return res.status(400).json({
      error: 'invalid username/password'
    });

  const { username, name, id } = user;
  const token = jwt.sign({ username, id }, process.env.SECRET);
  res.status(200).json({ token, username, name, id });
});

module.exports = loginRouter;

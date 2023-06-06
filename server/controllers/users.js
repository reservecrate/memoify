const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

usersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json(user);
});

usersRouter.post('/', async (req, res) => {
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
  const savedUser = await new User({ username, name, passwordHash }).save();
  res.status(201).json(savedUser);
});

// usersRouter.put('/:id', async (req, res) => {});

// usersRouter.delete('/:id', async (req, res) => {});

module.exports = usersRouter;

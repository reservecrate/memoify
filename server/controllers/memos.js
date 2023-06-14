const memosRouter = require('express').Router();
const Memo = require('../models/memo');

memosRouter.get('/', async (req, res) => {
  const memos = await Memo.find({}).populate('user', { username: 1, name: 1 });
  res.status(200).json(memos);
});

memosRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findById(id).populate('user', {
    username: 1,
    name: 1
  });
  res.status(200).json(memo);
});

memosRouter.post('/', async (req, res) => {
  !req.body.title ? (req.body.title = 'untitled memo') : null;
  !req.body.content ? (req.body.content = '') : null;
  !req.body.dateCreated ? (req.body.dateCreated = Date.now()) : null;

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'missing/invalid token' });
  const createdMemo = await (
    await new Memo({ ...req.body, user: user.id }).populate('user', {
      username: 1,
      name: 1
    })
  ).save();
  user.memos = [...user.memos, createdMemo.id];
  await user.save();
  res.status(201).json(createdMemo);
});

module.exports = memosRouter;

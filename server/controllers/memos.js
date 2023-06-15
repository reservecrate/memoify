const memosRouter = require('express').Router();
const Memo = require('../models/memo');
const { getMemoById } = require('../utils/api_helper');

memosRouter.get('/', async (req, res) => {
  const memos = await Memo.find({});
  res.status(200).json(memos);
});

memosRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findById(id);
  res.status(200).json(memo);
});

memosRouter.post('/', async (req, res) => {
  !req.body.title ? (req.body.title = 'untitled memo') : null;
  !req.body.content ? (req.body.content = '') : null;
  !req.body.dateCreated ? (req.body.dateCreated = Date.now()) : null;

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'missing/invalid token' });
  const createdMemo = await new Memo({ ...req.body, user: user._id }).save();
  user.memos = [...user.memos, createdMemo.id];
  await user.save();
  res.status(201).json(createdMemo);
});

memosRouter.put('/:id', async (req, res) => {
  const memoId = req.params.id;
  const memoToUpdate = await getMemoById(memoId);
  if (!memoToUpdate)
    return res.status(404).json({ error: 'invalid/nonexistent memo id' });

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'token not given' });
  if (memoToUpdate.user.id !== user.id)
    return res.status(401).json({
      error: 'wrong/invalid token (not authorised)'
    });

  const updatedMemoData = req.body;
  updatedMemoData.user = updatedMemoData.user.id;
  const updatedMemo = await Memo.findByIdAndUpdate(memoId, updatedMemoData, {
    new: true
  }).populate('user', {
    username: 1,
    name: 1
  });
  res.status(200).json(updatedMemo);
  //res.status(200).json({updatedMemo}) ?????;
});

module.exports = memosRouter;

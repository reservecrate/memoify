const Memo = require('../../models/memo');

const createMemo = async (req, res) => {
  !req.body.title ? (req.body.title = 'untitled memo') : null;
  !req.body.content ? (req.body.content = '') : null;
  !req.body.dateCreated ? (req.body.dateCreated = Date.now()) : null;

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'missing/invalid token' });
  const createdMemo = await new Memo({ ...req.body, user: user._id }).save();
  user.memos = [...user.memos, createdMemo.id];
  await user.save();
  res.status(201).json(createdMemo);
};

module.exports = createMemo;

const Memo = require('../../models/memo');

const updateMemo = async (req, res) => {
  const memoId = req.params.id;
  const memoToUpdate = await Memo.findById(memoId);
  if (!memoToUpdate)
    return res.status(404).json({ error: 'invalid/nonexistent memo id' });

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'invalid/missing token' });
  if (memoToUpdate.user.toString() !== user.id)
    return res.status(401).json({
      error: 'wrong/invalid token (not authorised)'
    });

  const updatedMemoPayload = req.body;
  const updatedMemo = (
    await Memo.findByIdAndUpdate(memoId, updatedMemoPayload, {
      new: true
    }).populate('user', { username: 1, name: 1 })
  ).prettify();
  res.status(200).json(updatedMemo);
};

module.exports = updateMemo;

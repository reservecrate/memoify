const Memo = require('../../models/memo');

const putMemo = async (req, res) => {
  const memoId = req.params.id;
  const memoToUpdate = await Memo.findById(memoId);
  if (!memoToUpdate)
    return res.status(404).json({ error: 'invalid/nonexistent memo id' });

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'token not given' });
  if (memoToUpdate.user.toString() !== user.id)
    return res.status(401).json({
      error: 'wrong/invalid token (not authorised)'
    });

  const updatedMemoData = req.body;
  const updatedMemo = await Memo.findByIdAndUpdate(memoId, updatedMemoData, {
    new: true
  });
  res.status(200).json(updatedMemo);
};

module.exports = putMemo;

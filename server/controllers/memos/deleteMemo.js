const Memo = require('../../models/memo');

const deleteMemo = async (req, res) => {
  const memoId = req.params.id;
  const memoToDelete = await Memo.findById(memoId);

  const { user } = req;
  if (!user) return res.status(401).json({ error: 'invalid/missing token' });
  else if (memoToDelete.user.toString() !== user.id)
    return res.status(401).json({
      error: 'wrong token (not authorised)'
    });

  const deletedMemo = (
    await Memo.findByIdAndDelete(memoId).populate('user', {
      username: 1,
      name: 1
    })
  ).prettify();
  res.status(200).json(deletedMemo);
};

module.exports = deleteMemo;

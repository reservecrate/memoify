const Memo = require('../../models/memo');

const getMemos = async (req, res) => {
  const memos = await Memo.find({});
  res.status(200).json(memos);
};

const getMemo = async (req, res) => {
  const { id } = req.params;
  const memo = await Memo.findById(id);
  res.status(200).json(memo);
};

module.exports = { getMemos, getMemo };

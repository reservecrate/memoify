const { getAllMemos, getMemoById } = require('../../utils/api_helper');

const getMemos = async (req, res) => {
  const memos = await getAllMemos();
  res.status(200).json(memos);
};

const getMemo = async (req, res) => {
  const memo = await getMemoById(req.params.id);
  res.status(200).json(memo);
};

module.exports = { getMemos, getMemo };

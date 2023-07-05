const { getAllMemos, getMemoById } = require('../../utils/api_helper');

const getMemos = async (req, res) => {
  const memos = await getAllMemos();
  res.status(200).json(memos);
};

const getMemo = async (req, res) => {
  const { id } = req.params;
  const memo = await getMemoById(id);
  res.status(200).json(memo);
};

module.exports = { getMemos, getMemo };

const userMemosRouter = require('express').Router();
const { getAllMemosByAuthor } = require('../utils/api_helper');

const getMemosByAuthor = async (req, res) => {
  const memos = await getAllMemosByAuthor(req.params.username);
  res.status(200).json(memos);
};

userMemosRouter.get('/:username/memos', getMemosByAuthor);

module.exports = userMemosRouter;

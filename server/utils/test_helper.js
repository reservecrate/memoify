const User = require('../models/user');
const Memo = require('../models/memo');

const getAllUsers = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

const getAllMemos = async () => {
  const memos = await Memo.find({});
  return memos.map(memo => memo.toJSON());
};

module.exports = { getAllUsers,  getAllMemos };

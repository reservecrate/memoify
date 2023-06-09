const User = require('../models/user');
const Memo = require('../models/memo');

const getAllUsers = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON());
};

const getByUsername = async username => {
  const user = await User.findOne({ username });
  return user.toJSON();
};

const getUserById = async id => {
  const user = await User.findById(id);
  return user.toJSON();
};

const getAllMemos = async () => {
  const memos = await Memo.find({});
  return memos.map(memo => memo.toJSON());
};

module.exports = { getAllUsers, getByUsername, getUserById, getAllMemos };

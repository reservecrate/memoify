const User = require('../models/user');
const Memo = require('../models/memo');

const getAllUsers = async () => {
  const users = await User.find({}).populate('memos', { title: 1, content: 1 });
  return users.map(user => user.toJSON());
};

const getByUsername = async username => {
  const user = await User.findOne({ username }).populate('memos', {
    title: 1,
    content: 1
  });
  return user.toJSON();
};

const getUserById = async id => {
  const user = await User.findById(id).populate('memos', {
    title: 1,
    content: 1
  });
  return user.toJSON();
};

const getAllMemos = async () => {
  const memos = await Memo.find({}).populate('user', { username: 1, name: 1 });
  return memos.map(memo => memo.toJSON());
};

const getMemoById = async id => {
  const memo = await Memo.findById(id).populate('user', {
    username: 1,
    name: 1
  });
  return memo.toJSON();
};

module.exports = {
  getAllUsers,
  getByUsername,
  getUserById,
  getAllMemos,
  getMemoById
};

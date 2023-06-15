const User = require('../models/user');
const Memo = require('../models/memo');

/* USERS */
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

// user prettifiers

/* MEMOS */
const getAllMemos = async () => {
  const memos = await Memo.find({});
  return memos.map(memo => memo.prettify());
};

const getMemoById = async id => {
  const memo = await Memo.findById(id);
  return memo.prettify();
};

// memo prettifiers
const memosPrettifier = memos => {
  const prettifiedMemos = memos.map(memo => {
    const prettifiedMemo = {
      id: memo._id.toString(),
      title: memo.title,
      content: memo.content,
      dateCreated: memo.dateCreated,
      user: memo.user.toString()
    };
    return prettifiedMemo;
  });
  return prettifiedMemos;
};

const memoPrettifier = memo => {
  const prettifiedMemo = {
    id: memo._id.toString(),
    title: memo.title,
    content: memo.content,
    dateCreated: memo.dateCreated,
    user: memo.user.toString()
  };
  return prettifiedMemo;
};

module.exports = {
  getAllUsers,
  getByUsername,
  getUserById,
  getAllMemos,
  getMemoById,
  memosPrettifier,
  memoPrettifier
};

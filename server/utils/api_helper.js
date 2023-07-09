const User = require('../models/user');
const Memo = require('../models/memo');

/* USERS */

// user fetchers
const getAllUsers = async () => {
  const users = await User.find({});
  return users.map(user => user.prettify());
};

const getByUsername = async username => {
  const user = await User.findOne({ username });
  return user.prettify();
};

const getUserById = async id => {
  const user = await User.findById(id);
  return user.prettify();
};

/* MEMOS */

// memo fetchers
const getAllMemos = async () => {
  const memos = (
    await Memo.find({}).populate('user', {
      username: 1,
      name: 1
    })
  ).map(memo => memo.prettify());
  return memos;
};

const getMemoById = async id => {
  const memo = await Memo.findById(id);
  const prettifiedMemo = (
    await memo.populate('user', {
      username: 1,
      name: 1
    })
  ).prettify();
  return { memo, prettifiedMemo };
};

const getAllMemosByAuthor = async username => {
  const memos = (
    await Memo.find({}).populate('user', {
      username: 1,
      name: 1
    })
  ).map(memo => memo.prettify());
  const memosByAuthor = memos.filter(memo => memo.author.username === username);
  return memosByAuthor;
};

// const deleteMemo=async id=>{}

/* EXPORTS */
module.exports = {
  getAllUsers,
  getByUsername,
  getUserById,
  getAllMemos,
  getMemoById,
  getAllMemosByAuthor
};

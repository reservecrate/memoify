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

// user prettifiers
const prettifyUsers = users => {
  const prettifiedUsers = users.map(user => {
    const prettifiedUser = {
      id: user._id.toString(),
      username: user.username,
      name: user.name,
      memos: user.memos.map(memo => memo.toString())
    };
    return prettifiedUser;
  });
  return prettifiedUsers;
};

const prettifyUser = user => {
  const prettifiedUser = {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    memos: user.memos.map(memo => memo.toString())
  };
  return prettifiedUser;
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
  const memo = (
    await Memo.findById(id).populate('user', {
      username: 1,
      name: 1
    })
  ).prettify();
  return memo;
};

// memo prettifiers;
const prettifyMemos = memos => {
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

const prettifyMemo = memo => {
  const prettifiedMemo = {
    id: memo._id.toString(),
    title: memo.title,
    content: memo.content,
    dateCreated: memo.dateCreated,
    user: memo.user.toString()
  };
  return prettifiedMemo;
};

/* EXPORTS */
module.exports = {
  getAllUsers,
  getByUsername,
  getUserById,
  prettifyUsers,
  prettifyUser,
  getAllMemos,
  getMemoById,
  prettifyMemos,
  prettifyMemo
};

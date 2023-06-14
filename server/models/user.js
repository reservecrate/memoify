const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  memos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Memo'
    }
  ]
});

userSchema.plugin(uniqueValidator);

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    // returnedObject.memos = returnedObject.memos.map(memo => memo.toString());
    delete returnedObject._id;
    delete returnedObject.__v;
    // passwordHash should be hidden
    delete returnedObject.passwordHash;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

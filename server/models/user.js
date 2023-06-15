const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
  {
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
  },
  {
    methods: {
      prettify() {
        const prettifiedUser = {
          id: this._id.toString(),
          username: this.username,
          name: this.name,
          memos: this.memos.map(memo => memo.toString())
        };
        return prettifiedUser;
      }
    }
  }
);

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;
